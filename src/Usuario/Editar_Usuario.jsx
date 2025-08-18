import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalEscanearRostro from '../Componentes/Modal_InfoBiometrica/ModalEscanearRostro.jsx';
import ModalEscanearHuella from '../Componentes/Modal_infoBiometrica/ModalEscanearHuella.jsx';
import PantallaTransicion from '../Componentes/PantallaTransicion/PantallaTransicion.jsx';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';
import logo1 from '../assets/logo1.png';
import { fetchWithAuth } from '../utils/auth.js';
import './Usuario.css';

const EditarUsuario = () => {
  const navigate = useNavigate();
  
  // Get user data from localStorage (set by search page)
  const usuarioEditar = JSON.parse(localStorage.getItem('usuario_editar_temp') || '{}');
  const usuarioId = usuarioEditar.id || usuarioEditar.usuario_id;
  
  // Get biblioteca_id from localStorage
  const bibliotecaId = localStorage.getItem('biblioteca');

  // If no user data found, redirect back to search
  if (!usuarioId) {
    navigate('/Usuarios');
    return null;
  }

  // Initialize states with current biometric data
  const initialBiometricStatus = usuarioEditar.biometric_status || {
    foto_registrada: false,
    huella_registrada: false,
    tarjeta_registrada: false
  };

  // State for modals and biometric registration
  const [transicion, setTransicion] = useState(false);
  const [modalRostroOpen, setModalRostroOpen] = useState(false);
  const [modalHuellaOpen, setModalHuellaOpen] = useState(false);
  
  // Initialize with values from user data
  const [rostroRegistrado, setRostroRegistrado] = useState(initialBiometricStatus.foto_registrada);
  const [huellaRegistrada, setHuellaRegistrada] = useState(initialBiometricStatus.huella_registrada);

  // States for local fingerprint data
  const [huellaLocal, setHuellaLocal] = useState(null);
  const [huellaDetectadaLocal, setHuellaDetectadaLocal] = useState(false);

  // States for loading and errors
  const [loading, setLoading] = useState({
    rostro: false,
    huella: false,
    guardando: false,
    verificandoEstado: false
  });
  const [errors, setErrors] = useState({
    rostro: '',
    huella: '',
    guardado: ''
  });

  // ✅ NEW: States for read-only user info (just for display)
  const usuarioInfo = {
    nombre: usuarioEditar.nombre || '',
    apellido: usuarioEditar.apellido || '',
    correo: usuarioEditar.correo || '',
    celular: usuarioEditar.celular || '',
    genero: usuarioEditar.genero || 'No especificado'
  };

  // Check for local fingerprint data on mount
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

  // Verify current biometric status
  const verificarEstadoActual = async () => {
    try {
      setLoading(prev => ({ ...prev, verificandoEstado: true }));
      console.log('🔍 Verificando estado actual de datos biométricos para usuario:', usuarioId);

      const response = await fetchWithAuth(`/api/business/verificar-registro-completo/${usuarioId}?biblioteca_id=${bibliotecaId}`, {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Estado verificado:', data);
        
        const biometricStatus = data.data?.biometric_status;
        if (biometricStatus) {
          setRostroRegistrado(biometricStatus.foto_registrada || false);
          setHuellaRegistrada(biometricStatus.huella_registrada || false);
          
          console.log('📊 Estados actualizados:', {
            foto: biometricStatus.foto_registrada,
            huella: biometricStatus.huella_registrada
          });
        }
      } else if (response.status === 400 && data.code === 'VERIFY_04') {
        const biometricStatus = data.data?.biometric_status;
        if (biometricStatus) {
          setRostroRegistrado(biometricStatus.foto_registrada || false);
          setHuellaRegistrada(biometricStatus.huella_registrada || false);
        }
      } else {
        console.warn('⚠️ Error verificando estado:', data.msg);
      }

    } catch (error) {
      console.error('❌ Error verificando estado actual:', error);
    } finally {
      setLoading(prev => ({ ...prev, verificandoEstado: false }));
    }
  };

  // Load current state on mount
  useEffect(() => {
    if (usuarioId && bibliotecaId) {
      console.log('🔄 Inicializando edición para usuario:', usuarioId);
      verificarEstadoActual();
    }
  }, [usuarioId, bibliotecaId]);

  // Function to split email at @ symbol
  const splitEmailAtSymbol = (email) => {
    if (!email || !email.includes('@')) return { part1: email || '', part2: '' };
    const [part1, part2] = email.split('@');
    return { part1: part1 + '@', part2: part2 };
  };

  // Function to check if text is too long
  const isTextTooLong = (text, maxLength = 20) => {
    return text && text.length > maxLength;
  };

  // API Functions for biometric registration
  const registrarRostro = async (imagenBase64) => {
    try {
      setLoading(prev => ({ ...prev, rostro: true }));
      setErrors(prev => ({ ...prev, rostro: '' }));

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
        console.log('✅ Rostro actualizado exitosamente:', data);
        setRostroRegistrado(true);
        return { success: true, data };
      } else {
        throw new Error(data.msg || 'Error al actualizar rostro');
      }
    } catch (error) {
      console.error('❌ Error actualizando rostro:', error);
      setErrors(prev => ({ ...prev, rostro: error.message }));
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, rostro: false }));
    }
  };

  // ✅ SIMPLIFIED: Function to save only fingerprint changes
  const guardarCambiosHuella = async () => {
    try {
      setLoading(prev => ({ ...prev, guardando: true }));
      setErrors(prev => ({ ...prev, guardado: '' }));

      console.log('💾 Guardando huella para usuario:', usuarioId);

      // Only proceed if there's fingerprint data to save
      if (!huellaDetectadaLocal || !huellaLocal) {
        throw new Error('No hay datos de huella para guardar');
      }

      // Prepare fingerprint data
      const requestBody = {
        biblioteca_id: parseInt(bibliotecaId),
        huella_template: huellaLocal.template_data
      };

      // Call the verification endpoint with fingerprint data
      const response = await fetchWithAuth(`/api/business/verificar-registro-completo/${usuarioId}`, {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Huella actualizada exitosamente:', data);

        // Clean up local fingerprint data
        localStorage.removeItem(`huella_temp_${usuarioId}`);
        setHuellaLocal(null);
        setHuellaDetectadaLocal(false);
        setHuellaRegistrada(true);
        
        console.log('🗑️ Huella local eliminada después de la actualización exitosa');
        
        // Clear temporary user data
        localStorage.removeItem('usuario_editar_temp');
        
        // Show transition screen
        setTransicion(true);
        
        // Navigate back to users list
        setTimeout(() => {
          navigate('/Usuarios');
        }, 1200);

      } else {
        throw new Error(data.msg || 'Error al guardar huella');
      }

    } catch (error) {
      console.error('❌ Error guardando huella:', error);
      setErrors(prev => ({ ...prev, guardado: error.message }));
      alert(`Error al guardar huella: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, guardando: false }));
    }
  };

  // Modal handlers
  const handleAbrirModalRostro = () => {
    setModalRostroOpen(true);
  };
  
  const handleAbrirModalHuella = () => {
    setModalHuellaOpen(true);
  };

  const handleCerrarModalRostro = async (registrado, imagenBase64) => {
    setModalRostroOpen(false);
    if (registrado && imagenBase64) {
      const result = await registrarRostro(imagenBase64);
      if (!result.success) {
        alert(`Error al actualizar rostro: ${result.error}`);
      } else {
        // ✅ NEW: Auto-navigate after successful photo update
        setTimeout(() => {
          // Clear temporary user data
          localStorage.removeItem('usuario_editar_temp');
          
          // Show transition screen
          setTransicion(true);
          
          // Navigate back to users list
          setTimeout(() => {
            navigate('/Usuarios');
          }, 1200);
        }, 500);
      }
    }
  };

  const handleCerrarModalHuella = (registrado, huellaData) => {
    setModalHuellaOpen(false);
    if (registrado && huellaData) {
      try {
        localStorage.setItem(`huella_temp_${usuarioId}`, JSON.stringify(huellaData));
        setHuellaLocal(huellaData);
        setHuellaDetectadaLocal(true);
        setErrors(prev => ({ ...prev, huella: '' }));
        
        console.log('✅ Huella detectada y guardada localmente para usuario:', usuarioId);
      } catch (error) {
        console.error('❌ Error guardando huella localmente:', error);
        setErrors(prev => ({ ...prev, huella: 'Error guardando huella localmente' }));
        alert('Error al guardar la huella localmente');
      }
    }
  };

  // Validation for required data
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

  // Split email for display
  const { part1: emailPart1, part2: emailPart2 } = splitEmailAtSymbol(usuarioInfo.correo);

  return (
    <div className="usuario-editar-bg">
      <Sidebar />
      <main className="main-content">
        <h1 className="prestamos-title">Actualizar Datos Biométricos</h1>
        <hr className="prestamos-divider" />
        
        {/* Show loading while verifying initial state */}
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
              
              {/* ✅ CORRECTED: Read-only info card - same as Registrar_Usuario.jsx */}
              <div className="usuario-editar-info-card">
                {/* Nombre - Read-only */}
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Nombre:</span>
                  <span className="usuario-editar-info-value">
                    {usuarioInfo.nombre} {usuarioInfo.apellido}
                  </span>
                </div>

                {/* Correo - Read-only */}
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Correo:</span>
                  <span className="usuario-editar-info-value">
                    {usuarioInfo.correo}
                  </span>
                </div>

                {/* Teléfono - Read-only */}
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Teléfono:</span>
                  <span className="usuario-editar-info-value">
                    {usuarioInfo.celular || 'No especificado'}
                  </span>
                </div>

                {/* Género - Read-only */}
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Género:</span>
                  <span className="usuario-editar-info-value">
                    {usuarioInfo.genero}
                  </span>
                </div>
              </div>
              
              {/* ✅ CONDITIONAL: Show save button only if there's unsaved fingerprint data */}
              {huellaDetectadaLocal && !huellaRegistrada && (
                <>
                  <button
                    className="usuario-editar-guardar-cambios-btn-custom"
                    disabled={loading.guardando}
                    style={{
                      margin: '40px auto 0 auto',
                      border: 'none',
                      color: '#FFF',
                      fontFamily: 'League Spartan',
                      fontSize: '20px',
                      fontWeight: 600,
                      cursor: loading.guardando ? 'not-allowed' : 'pointer',
                      display: 'block',
                      opacity: loading.guardando ? 0.7 : 1,
                      backgroundColor: loading.guardando ? '#9CA3AF' : undefined
                    }}
                    onClick={guardarCambiosHuella}
                  >
                    {loading.guardando ? 'Guardando huella...' : 'Guardar huella'}
                  </button>

                  {/* Show save error if exists */}
                  {errors.guardado && (
                    <div style={{
                      color: '#dc2626',
                      fontSize: '12px',
                      marginTop: '5px',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      {errors.guardado}
                    </div>
                  )}
                </>
              )}

              {/* ✅ NEW: Back button when no pending changes */}
              {!huellaDetectadaLocal && (
                <button
                  className="usuario-editar-volver-btn-custom"
                  style={{
                    margin: '40px auto 0 auto',
                    border: '2px solid #6B7280',
                    color: '#6B7280',
                    backgroundColor: 'transparent',
                    fontFamily: 'League Spartan',
                    fontSize: '20px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'block',
                    padding: '10px 20px',
                    borderRadius: '8px'
                  }}
                  onClick={() => navigate('/Usuarios')}
                >
                  Volver a usuarios
                </button>
              )}
            </div>
          </div>
          
          {/* ✅ SIMPLIFIED: Only photo and fingerprint sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginLeft: '30px' }}>
            {/* Actualizar foto section */}
            <div className="usuario-editar-cuadro-secundario usuario-editar-cuadro-secundario-primero">
              <div className="usuario-editar-cuadro-titulo">Actualizar foto</div>
              <div className="usuario-editar-cuadro-imagen-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" fill="none">
                  <path d="M43.75 112.5V82C43.75 78.134 46.884 75 50.75 75H99.25C103.116 75 106.25 78.134 106.25 82V112.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M75 75C85.3553 75 93.75 66.6053 93.75 56.25C93.75 45.8947 85.3553 37.5 75 37.5C64.6447 37.5 56.25 45.8947 56.25 56.25C56.25 66.6053 64.6447 75 75 75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M131.25 19.35V130.65C131.25 130.981 130.981 131.25 130.65 131.25H19.35C19.0186 131.25 18.75 130.981 18.75 130.65V19.35C18.75 19.0186 19.0186 18.75 19.35 18.75H130.65C130.981 18.75 131.25 19.0186 131.25 19.35Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <button
                className="usuario-editar-registrar-btn"
                onClick={handleAbrirModalRostro}
                disabled={loading.rostro}
                style={{
                  opacity: loading.rostro ? 0.7 : 1,
                  cursor: loading.rostro ? 'not-allowed' : 'pointer'
                }}
              >
                {loading.rostro ? 'Actualizando...' : (rostroRegistrado ? 'Actualizar' : 'Registrar')}
              </button>
              {errors.rostro && <div style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.rostro}</div>}
              
            </div>

            {/* Actualizar huella section */}
            <div className="usuario-editar-cuadro-secundario usuario-editar-cuadro-secundario-segundo">
              <div className="usuario-editar-cuadro-titulo">Actualizar huella</div>
              <div className="usuario-editar-cuadro-imagen-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" fill="none">
                  <path d="M43.75 100V71.0096C43.75 67.8236 44.3766 64.7652 45.5282 61.9231M106.25 100V80.0962M57.6389 48.3404C62.6045 45.4409 68.5759 43.75 75 43.75C89.2469 43.75 101.267 52.0664 105.029 63.4375" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M62.5 106.25V92.6471M87.5 106.25V74.0809C87.5 67.6849 81.9036 62.5 75 62.5C68.0964 62.5 62.5 67.6849 62.5 74.0809V79.0441" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M37.5 18.75H18.75V37.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M112.5 18.75H131.25V37.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M37.5 131.25H18.75V112.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M112.5 131.25H131.25V112.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <button
                className="usuario-editar-registrar-btn"
                onClick={handleAbrirModalHuella}
                disabled={loading.huella}
                style={{
                  opacity: loading.huella ? 0.7 : 1,
                  cursor: loading.huella ? 'not-allowed' : 'pointer'
                }}
              >
                {loading.huella ? 'Detectando...' : 
                 (huellaRegistrada || huellaDetectadaLocal ? 'Actualizar' : 'Detectar')}
              </button>
              {errors.huella && <div style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.huella}</div>}
              
            </div>
          </div>
        </div>
      </main>

      {/* Biometric modals */}
      {modalRostroOpen && (
        <ModalEscanearRostro onClose={handleCerrarModalRostro} />
      )}
      {modalHuellaOpen && (
        <ModalEscanearHuella onClose={handleCerrarModalHuella} />
      )}

      {/* Transition screen */}
      {transicion && (
        <PantallaTransicion
          icono={logo1}
          soloIcono={true}
        />
      )}
    </div>
  );
};

export default EditarUsuario;
