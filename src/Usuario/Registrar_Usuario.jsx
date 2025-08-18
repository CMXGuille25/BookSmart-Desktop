import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalEscanearRostro from '../Componentes/Modal_InfoBiometrica/ModalEscanearRostro.jsx';
import ModalEscanearTarjeta from '../Componentes/Modal_InfoBiometrica/ModalEscanearTarjeta.jsx';
import ModalEscanearHuella from '../Componentes/Modal_infoBiometrica/ModalEscanearHuella.jsx';
import PantallaTransicion from '../Componentes/PantallaTransicion/PantallaTransicion.jsx';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';
import logo1 from '../assets/logo1.png';
import { fetchWithAuth } from '../utils/auth.js';
import './Usuario.css';

const RegistrarUsuario = () => {
  const navigate = useNavigate();
  
  // Get user data from localStorage (set by search page)
  const usuarioTemp = JSON.parse(localStorage.getItem('usuario_registro_temp') || '{}');
  const usuarioId = usuarioTemp.id || localStorage.getItem('usuario_id') || localStorage.getItem('user_id');
  
  // Get biblioteca_id from localStorage
  const bibliotecaId = localStorage.getItem('biblioteca');

  // If no user data found, redirect back to search
  if (!usuarioTemp.id) {
    navigate('/Buscar_Usuario_Email');
    return null;
  }

  // ✅ NUEVO: Inicializar estados con datos biométricos desde la búsqueda
  const initialBiometricStatus = usuarioTemp.biometric_status || {
    foto_registrada: false,
    huella_registrada: false,
    tarjeta_registrada: false,
    datos_adicional_existe: false
  };

  // Estado para modales y registro de biométricos
  const [transicion, setTransicion] = useState(false);
  const [modalRostroOpen, setModalRostroOpen] = useState(false);
  const [modalHuellaOpen, setModalHuellaOpen] = useState(false);
  const [modalTarjetaOpen, setModalTarjetaOpen] = useState(false);
  
  // ✅ MODIFICADO: Inicializar con valores desde la búsqueda
  const [rostroRegistrado, setRostroRegistrado] = useState(initialBiometricStatus.foto_registrada);
  const [huellaRegistrada, setHuellaRegistrada] = useState(initialBiometricStatus.huella_registrada);
  const [tarjetaRegistrada, setTarjetaRegistrada] = useState(initialBiometricStatus.tarjeta_registrada);

  // ✅ NUEVO: Estados para datos locales de huella
  const [huellaLocal, setHuellaLocal] = useState(null); // Guardar datos de huella localmente
  const [huellaDetectadaLocal, setHuellaDetectadaLocal] = useState(false); // Si se detectó huella localmente
  // Estados para loading y errores
  const [loading, setLoading] = useState({
    rostro: false,
    huella: false,
    tarjeta: false,
    finalizando: false,
    verificandoEstado: false
  });
  const [errors, setErrors] = useState({
    rostro: '',
    huella: '',
    tarjeta: '',
    finalizacion: ''
  });

  // Habilitar botón solo si los tres están registrados
  const registroCompleto = rostroRegistrado && (huellaRegistrada || huellaDetectadaLocal) && tarjetaRegistrada;

  useEffect(() => {
    const huellaLocalStorage = localStorage.getItem(`huella_temp_${usuarioId}`);
    if (huellaLocalStorage) {
      try {
        const huellaData = JSON.parse(huellaLocalStorage);
        setHuellaLocal(huellaData);
        setHuellaDetectadaLocal(true);
        console.log('🔍 Huella encontrada en localStorage para usuario:', usuarioId);
      } catch (error) {
        console.error('❌ Error parsing huella local:', error);
        localStorage.removeItem(`huella_temp_${usuarioId}`);
      }
    }
  }, [usuarioId]);

  // ✅ MODIFICADO: Verificar estado actual solo si es necesario
  const verificarEstadoActual = async () => {
    // Si ya tenemos información completa desde la búsqueda, no es necesario verificar nuevamente
    if (initialBiometricStatus.datos_adicional_existe && 
        (initialBiometricStatus.foto_registrada && initialBiometricStatus.huella_registrada && initialBiometricStatus.tarjeta_registrada)) {
      console.log('✅ Estados biométricos ya completos, omitiendo verificación adicional');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, verificandoEstado: true }));
      console.log('🔍 Verificando estado actual de datos biométricos para usuario:', usuarioId);

      const response = await fetchWithAuth(`/api/business/verificar-registro-completo/${usuarioId}?biblioteca_id=${bibliotecaId}`, {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Estado verificado:', data);
        
        // Actualizar estados basado en la respuesta
        const biometricStatus = data.data?.biometric_status;
        if (biometricStatus) {
          setRostroRegistrado(biometricStatus.foto_registrada || false);
          setHuellaRegistrada(biometricStatus.huella_registrada || false);
          setTarjetaRegistrada(biometricStatus.tarjeta_registrada || false);
          
          console.log('📊 Estados actualizados:', {
            foto: biometricStatus.foto_registrada,
            huella: biometricStatus.huella_registrada,
            tarjeta: biometricStatus.tarjeta_registrada
          });
        }
      } else if (response.status === 400 && data.code === 'VERIFY_04') {
        // Registro incompleto - esto es normal, actualizar estados
        const biometricStatus = data.data?.biometric_status;
        if (biometricStatus) {
          setRostroRegistrado(biometricStatus.foto_registrada || false);
          setHuellaRegistrada(biometricStatus.huella_registrada || false);
          setTarjetaRegistrada(biometricStatus.tarjeta_registrada || false);
          
          console.log('📊 Estados actualizados (incompleto):', {
            foto: biometricStatus.foto_registrada,
            huella: biometricStatus.huella_registrada,
            tarjeta: biometricStatus.tarjeta_registrada
          });
        }
      } else {
        console.warn('⚠️ Error verificando estado:', data.msg);
        // No mostrar error, solo log para debug
      }

    } catch (error) {
      console.error('❌ Error verificando estado actual:', error);
      // No mostrar error al usuario, es solo para mejorar UX
    } finally {
      setLoading(prev => ({ ...prev, verificandoEstado: false }));
    }
  };

  // ✅ MODIFICADO: useEffect más inteligente
  useEffect(() => {
    console.log('🔄 Inicializando componente con estados biométricos:', initialBiometricStatus);
    
    // Solo verificar estado si no tenemos información completa o confiable
    if (usuarioId && bibliotecaId && !initialBiometricStatus.datos_adicional_existe) {
      console.log('⚠️ No hay datos adicionales confirmados, verificando estado actual...');
      verificarEstadoActual();
    }
  }, [usuarioId, bibliotecaId]);

  // Function to split email at @ symbol
  const splitEmailAtSymbol = (email) => {
    if (!email || !email.includes('@')) return { part1: email || '', part2: '' };
    const [part1, part2] = email.split('@');
    return { part1: part1 + '@', part2: part2 };
  };

  // Function to check if text is too long for inline display
  const isTextTooLong = (text, maxLength = 20) => {
    return text && text.length > maxLength;
  };

  // API Functions - Solo para rostro (las otras se manejan en los modales)
  const registrarRostro = async (imagenBase64) => {
    try {
      setLoading(prev => ({ ...prev, rostro: true }));
      setErrors(prev => ({ ...prev, rostro: '' }));

      // Validate required data
      if (!bibliotecaId) {
        throw new Error('ID de biblioteca no encontrado. Por favor inicia sesión nuevamente.');
      }

      const response = await fetchWithAuth('/api/business/registrar-rostro', {
        method: 'POST',
        body: JSON.stringify({
          usuario_id: parseInt(usuarioId),
          biblioteca_id: parseInt(bibliotecaId),
          imagen: imagenBase64
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'Registro exitoso') {
        console.log('✅ Rostro registrado exitosamente:', data);
        setRostroRegistrado(true);
        return { success: true, data };
      } else {
        throw new Error(data.msg || 'Error al registrar rostro');
      }
    } catch (error) {
      console.error('❌ Error registrando rostro:', error);
      setErrors(prev => ({ ...prev, rostro: error.message }));
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, rostro: false }));
    }
  };

  // Function to verify complete registration and finalize
  const verificarYFinalizarRegistro = async () => {
    try {
      setLoading(prev => ({ ...prev, finalizando: true }));
      setErrors(prev => ({ ...prev, finalizacion: '' }));

      console.log('🔍 Verificando registro completo para usuario:', usuarioId);

      // ✅ NUEVO: Preparar payload con huella local si existe
    const requestBody = {
        biblioteca_id: parseInt(bibliotecaId)
      };

      // ✅ CORREGIDO: Enviar template_data como huella_template
      if (huellaDetectadaLocal && huellaLocal) {
        requestBody.huella_template = huellaLocal.template_data;
        console.log('📤 Incluyendo template de huella local en la verificación:', huellaLocal.template_data);
      } else {
        // Si no hay huella local, el API retornará error apropiado
        console.warn('⚠️ No hay huella local disponible para enviar');
      }

      // Call the verification endpoint
      const response = await fetchWithAuth(`/api/business/verificar-registro-completo/${usuarioId}`, {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
      console.log('✅ Verificación exitosa:', data);

      // ✅ CORRECCIÓN: Acceder a la estructura correcta de la respuesta
      const biometricStatus = data.data?.biometric_status;
      const registroCompleto = biometricStatus?.registro_completo;

      if (registroCompleto) {
        console.log('✅ Registro biométrico completo, finalizando...');
        
        // Update local state based on successful registration
        setRostroRegistrado(biometricStatus.foto_registrada);
        setHuellaRegistrada(biometricStatus.huella_registrada);
        setTarjetaRegistrada(biometricStatus.tarjeta_registrada);

        // ✅ NUEVO: Limpiar huella local ya que se guardó en BD
          if (huellaDetectadaLocal) {
            localStorage.removeItem(`huella_temp_${usuarioId}`);
            setHuellaLocal(null);
            setHuellaDetectadaLocal(false);
            console.log('🗑️ Huella local eliminada después del registro exitoso');
          }
        
        // Clear temporary user data
        localStorage.removeItem('usuario_registro_temp');
        
        // Show transition screen
        setTransicion(true);
        
        // Navigate after transition
        setTimeout(() => {
          navigate('/Usuarios');
        }, 1200);

      } else {
        // Registration is not complete, show specific missing items
        const missingItems = data.data?.missing_items || [];
        
        // ✅ CORRECCIÓN: Actualizar estado local basado en la respuesta real
        if (biometricStatus) {
          setRostroRegistrado(biometricStatus.foto_registrada || false);
          setHuellaRegistrada(biometricStatus.huella_registrada || false);
          setTarjetaRegistrada(biometricStatus.tarjeta_registrada || false);
        }

        throw new Error(`Registro incompleto. Faltan: ${missingItems.join(', ')}`);
      }

    } else {
      // Handle different error codes from backend
      let errorMessage = data.msg || 'Error al verificar el registro';
      
      switch (data.code) {
        case 'VERIFY_01':
        case 'VERIFY_01A':
          errorMessage = 'Datos de usuario o biblioteca inválidos';
          break;
        case 'VERIFY_02':
          errorMessage = 'Usuario no encontrado en el sistema';
          break;
        case 'VERIFY_03':
          errorMessage = 'No se encontraron datos biométricos del usuario';
          break;
        case 'VERIFY_04':
          // This is actually a partial success - update UI state
          const biometricStatus = data.data?.biometric_status;
          if (biometricStatus) {
            setRostroRegistrado(biometricStatus.foto_registrada || false);
            setHuellaRegistrada(biometricStatus.huella_registrada || false);
            setTarjetaRegistrada(biometricStatus.tarjeta_registrada || false);
          }
          errorMessage = data.msg;
          break;
        default:
          errorMessage = data.msg || 'Error desconocido al verificar el registro';
      }
      
      throw new Error(errorMessage);
    }

    } catch (error) {
      console.error('❌ Error verificando registro:', error);
      setErrors(prev => ({ ...prev, finalizacion: error.message }));

      // Show error alert to user
      alert(`Error al finalizar registro: ${error.message}`);

    } finally {
      setLoading(prev => ({ ...prev, finalizando: false }));
    }
  };

  // ✅ MODIFICADO: Handlers que verifican estado antes de abrir
  const handleAbrirModalRostro = () => {
    if (!rostroRegistrado) {
      setModalRostroOpen(true);
    }
  };
  
  const handleAbrirModalHuella = () => {
    if (!huellaRegistrada && !huellaDetectadaLocal) {
      setModalHuellaOpen(true);
    }
  };
  
  const handleAbrirModalTarjeta = () => {
    if (!tarjetaRegistrada) {
      setModalTarjetaOpen(true);
    }
  };

  // ✅ HANDLERS SIMPLIFICADOS - Solo actualizan estado
  const handleCerrarModalRostro = async (registrado, imagenBase64) => {
    setModalRostroOpen(false);
    if (registrado && imagenBase64) {
      const result = await registrarRostro(imagenBase64);
      if (!result.success) {
        alert(`Error al registrar rostro: ${result.error}`);
      }
    }
  };

  const handleCerrarModalHuella = (registrado, huellaData) => {
    setModalHuellaOpen(false);
    if (registrado && huellaData) {
      // ✅ NUEVO: Guardar huella localmente en lugar de en BD
      try {
        localStorage.setItem(`huella_temp_${usuarioId}`, JSON.stringify(huellaData));
        setHuellaLocal(huellaData);
        setHuellaDetectadaLocal(true);
        setErrors(prev => ({ ...prev, huella: '' }));
        
        console.log('✅ Huella detectada y guardada localmente para usuario:', usuarioId);
        console.log('📦 Datos de huella guardados en localStorage con key:', `huella_temp_${usuarioId}`);
      } catch (error) {
        console.error('❌ Error guardando huella localmente:', error);
        setErrors(prev => ({ ...prev, huella: 'Error guardando huella localmente' }));
        alert('Error al guardar la huella localmente');
      }
    }
  };

  const handleCerrarModalTarjeta = (registrado) => {
    setModalTarjetaOpen(false);
    if (registrado) {
      // ✅ SIMPLIFICADO - Solo actualizar el estado
      console.log('✅ Tarjeta registrada exitosamente desde el modal');
      setTarjetaRegistrada(true);
      setErrors(prev => ({ ...prev, tarjeta: '' }));
    }
  };

  // Split email for display
  const { part1: emailPart1, part2: emailPart2 } = splitEmailAtSymbol(usuarioTemp.email);

  // Add early validation for required data
  if (!bibliotecaId) {
    return (
      <div className="usuario-editar-bg">
        <Sidebar />
        <main className="main-content">
          <h1 className="prestamos-title">Usuarios</h1>
          <hr className="prestamos-divider" />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ 
              color: '#dc2626', 
              fontSize: '18px', 
              fontWeight: '500',
              textAlign: 'center'
            }}>
              ⚠️ Datos de sesión incompletos
            </div>
            <div style={{ 
              color: '#6b7280', 
              fontSize: '14px',
              textAlign: 'center'
            }}>
              No se encontró el ID de biblioteca. Por favor inicia sesión nuevamente.
            </div>
            <button 
              onClick={() => navigate('/Inicio')}
              style={{
                backgroundColor: '#3B82F6',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Ir al inicio de sesión
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="usuario-editar-bg">
      <Sidebar />
      <main className="main-content">
        <h1 className="prestamos-title">Usuarios</h1>
        <hr className="prestamos-divider" />
        
        {/* ✅ NUEVO: Mostrar loading mientras verifica estado inicial */}
        {loading.verificandoEstado && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            🔍 Verificando datos biométricos existentes...
          </div>
        )}
        
        <div className="usuario-editar-content-row">
          <div className="usuario-editar-card" style={{ height: '580px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <div className="usuario-editar-libro-imagen usuario-editar-libro-imagen-top"></div>
              
              {/* Info card with email split at @ */}
              <div className="usuario-editar-info-card">
                {/* Nombre - Normal layout */}
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Nombre:</span>
                  <span className="usuario-editar-info-value">{usuarioTemp.nombre}</span>
                </div>

                {/* Apellidos - Normal layout */}
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Apellidos:</span>
                  <span className="usuario-editar-info-value">{usuarioTemp.apellido}</span>
                </div>

                {/* Correo - Split at @ symbol */}
                <div className="usuario-editar-info-row usuario-editar-info-row-stacked">
                  <span className="usuario-editar-info-label">Correo:</span>
                  <div className="usuario-editar-info-value" style={{
                    fontSize: '13px',
                    lineHeight: '1.2',
                    marginTop: '4px'
                  }}>
                    <div>{emailPart1}</div>
                    <div>{emailPart2}</div>
                  </div>
                </div>

                {/* Teléfono - Adaptive layout */}
                <div className={`usuario-editar-info-row ${isTextTooLong(usuarioTemp.telefono, 15) ? 'usuario-editar-info-row-stacked' : ''}`}>
                  <span className="usuario-editar-info-label">Teléfono:</span>
                  <span 
                    className="usuario-editar-info-value"
                    style={isTextTooLong(usuarioTemp.telefono, 15) ? {
                      fontSize: '14px',
                      wordBreak: 'break-all',
                      marginTop: '4px'
                    } : {}}
                  >
                    {usuarioTemp.telefono || 'No especificado'}
                  </span>
                </div>

                {/* Género - Normal layout */}
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Género:</span>
                  <span className="usuario-editar-info-value">{usuarioTemp.genero || 'No especificado'}</span>
                </div>
              </div>
              
              {/* Updated Finalizar registro button */}
              <button
                className="usuario-finalizar-registro-btn"
                disabled={!registroCompleto || loading.finalizando}
                style={{
                  backgroundColor: !registroCompleto ? '#BDBDBD' : (loading.finalizando ? '#9CA3AF' : '#2F5232'),
                  color: !registroCompleto ? '#757575' : 'white',
                  cursor: (!registroCompleto || loading.finalizando) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  opacity: loading.finalizando ? 0.8 : 1
                }}
                onClick={verificarYFinalizarRegistro}
              >
                {loading.finalizando ? 'Finalizando...' : 'Finalizar registro'}
              </button>

              {/* Show finalization error if exists */}
              {errors.finalizacion && (
                <div style={{
                  color: '#dc2626',
                  fontSize: '12px',
                  marginTop: '5px',
                  textAlign: 'center',
                  fontWeight: '500'
                }}>
                  {errors.finalizacion}
                </div>
              )}
            </div>
          </div>
          
          {/* Tres recuadros pequeños uno sobre otro, lado derecho */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginLeft: '30px' }}>
            {/* Subir foto section */}
            <div className="usuario-registrar-cuadro-pequeno usuario-registrar-cuadro-pequeno-primero">
              <div className="usuario-editar-cuadro-titulo">Subir foto</div>
              <div className="usuario-registrar-cuadro-marron">
                <svg xmlns="http://www.w3.org/2000/svg" width="79" height="79" viewBox="0 0 79 79" fill="none">
                  <path d="M23.0415 59V46.5C23.0415 42.634 26.1755 39.5 30.0415 39.5H48.9582C52.8242 39.5 55.9582 42.634 55.9582 46.5V59" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M39.5 39.5C44.9538 39.5 49.375 35.1348 49.375 29.75C49.375 24.3652 44.9538 20 39.5 20C34.0462 20 29.625 24.3652 29.625 29.75C29.625 35.1348 34.0462 39.5 39.5 39.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M69.125 10.85V68.15C69.125 68.4814 68.8564 68.75 68.525 68.75H10.475C10.1436 68.75 9.875 68.4814 9.875 68.15V10.85C9.875 10.5186 10.1436 10.25 10.475 10.25H68.525C68.8564 10.25 69.125 10.5186 69.125 10.85Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <button
                className="usuario-registrar-btn"
                style={{ 
                  backgroundColor: rostroRegistrado ? '#3CB371' : '#2F5232',
                  color: 'white',
                  opacity: loading.rostro ? 0.7 : 1,
                  cursor: rostroRegistrado ? 'not-allowed' : 'pointer'
                }}
                onClick={handleAbrirModalRostro}
                disabled={rostroRegistrado || loading.rostro}
              >
                {loading.rostro ? 'Registrando...' : (rostroRegistrado ? 'Registrado' : 'Registrar')}
              </button>
              {errors.rostro && <div style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.rostro}</div>}
            </div>

            <div className="usuario-registrar-cuadro-pequeno usuario-registrar-cuadro-pequeno-segundo">
              <div className="usuario-editar-cuadro-titulo">Huella</div>
              <div className="usuario-registrar-cuadro-marron">
                <svg xmlns="http://www.w3.org/2000/svg" width="79" height="81" viewBox="0 0 79 81" fill="none">
                  <path d="M23.0415 53.8332V38.3717C23.0415 36.6725 23.3715 35.0413 23.978 33.5256M55.9582 53.8332V43.2179M30.3563 26.2814C32.9715 24.7351 36.1165 23.8333 39.4998 23.8333C47.0032 23.8333 53.3338 28.2686 55.3149 34.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M32.9165 57.1666V49.9117M46.0832 57.1666V40.0097C46.0832 36.5986 43.1357 33.8333 39.4998 33.8333C35.864 33.8333 32.9165 36.5986 32.9165 40.0097V42.6568" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.75 10.5H9.875V20.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M59.25 10.5H69.125V20.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.75 70.5H9.875V60.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M59.25 70.5H69.125V60.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <button
                className="usuario-registrar-btn"
                style={{ 
                  // ✅ MODIFICADO: Verde si está registrada en BD O detectada localmente
                  backgroundColor: (huellaRegistrada || huellaDetectadaLocal) ? '#3CB371' : '#2F5232',
                  color: 'white',
                  opacity: loading.huella ? 0.7 : 1,
                  cursor: (huellaRegistrada || huellaDetectadaLocal) ? 'not-allowed' : 'pointer'
                }}
                onClick={handleAbrirModalHuella}
                disabled={huellaRegistrada || huellaDetectadaLocal || loading.huella}
              >
                {loading.huella ? 'Detectando...' : 
                 (huellaRegistrada ? 'Registrado' : 
                  (huellaDetectadaLocal ? 'Registrado' : 'Registrar'))}
              </button>
            
              {errors.huella && <div style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.huella}</div>}
            </div>

            <div className="usuario-registrar-cuadro-pequeno usuario-registrar-cuadro-pequeno-tercero">
              <div className="usuario-editar-cuadro-titulo">Asignar tarjeta</div>
              <div className="usuario-registrar-cuadro-marron">
                <svg xmlns="http://www.w3.org/2000/svg" width="79" height="81" viewBox="0 0 79 81" fill="none">
                  <path d="M72.4168 30.5001V19.1667C72.4168 18.0622 71.5214 17.1667 70.4168 17.1667H8.58349C7.47892 17.1667 6.5835 18.0622 6.5835 19.1667V61.8334C6.5835 62.938 7.47893 63.8334 8.5835 63.8334H46.0835M72.4168 30.5001H19.7502M72.4168 30.5001V43.8334" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M69.6738 62.1667H71.8168C72.1482 62.1667 72.4168 62.4353 72.4168 62.7667V73.2333C72.4168 73.5647 72.1482 73.8333 71.8168 73.8333H56.5585C56.2271 73.8333 55.9585 73.5647 55.9585 73.2333V62.7667C55.9585 62.4353 56.2271 62.1667 56.5585 62.1667H58.7016M69.6738 62.1667V56.3333C69.6738 54.3889 68.5766 50.5 64.1877 50.5C59.7988 50.5 58.7016 54.3889 58.7016 56.3333V62.1667M69.6738 62.1667H58.7016" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <button
                className="usuario-registrar-btn"
                style={{ 
                  backgroundColor: tarjetaRegistrada ? '#3CB371' : '#2F5232',
                  color: 'white',
                  opacity: loading.tarjeta ? 0.7 : 1,
                  cursor: tarjetaRegistrada ? 'not-allowed' : 'pointer'
                }}
                onClick={handleAbrirModalTarjeta}
                disabled={tarjetaRegistrada || loading.tarjeta}
              >
                {loading.tarjeta ? 'Registrando...' : (tarjetaRegistrada ? 'Registrado' : 'Registrar')}
              </button>
              {errors.tarjeta && <div style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.tarjeta}</div>}
            </div>
          </div>
        </div>
      </main>

      {/* Modales biométricos */}
      {modalRostroOpen && (
        <ModalEscanearRostro onClose={handleCerrarModalRostro} />
      )}
      {modalHuellaOpen && (
        <ModalEscanearHuella onClose={handleCerrarModalHuella} />
      )}
      {modalTarjetaOpen && (
        <ModalEscanearTarjeta onClose={handleCerrarModalTarjeta} />
      )}

      {/* Pantalla de transición */}
      {transicion && (
        <PantallaTransicion
          icono={logo1}
          soloIcono={true}
        />
      )}
    </div>
  );
};

export default RegistrarUsuario;
