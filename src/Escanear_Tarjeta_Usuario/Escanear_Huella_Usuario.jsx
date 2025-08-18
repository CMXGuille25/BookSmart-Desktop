import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PantallaTransicion from '../Componentes/PantallaTransicion/PantallaTransicion';
import Sidebar from '../Componentes/Sidebar/Sidebar';
import logo1 from '../assets/logo1.png';
import { fetchWithAuth } from '../utils/auth.js';
import './Escanear_Usuario.css';

const Escanear_Huella_Usuario = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [usuarioData, setUsuarioData] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [huellaVerificada, setHuellaVerificada] = useState(null);
  const navigate = useNavigate();

  // ✅ ADDED: Get biblioteca_id from localStorage
  const bibliotecaId = localStorage.getItem('biblioteca');

  // Cargar datos del usuario del paso anterior
  useEffect(() => {
    const usuarioTemp = localStorage.getItem('usuario_prestamo_temp');
    if (usuarioTemp) {
      try {
        const userData = JSON.parse(usuarioTemp);
        setUsuarioData(userData);
        console.log('📄 Datos del usuario cargados:', userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/Escanear_Tarjeta_Usuario'); // Regresar al paso anterior
      }
    } else {
      console.warn('⚠️ No se encontraron datos del usuario, regresando al paso anterior');
      navigate('/Escanear_Tarjeta_Usuario');
    }
  }, [navigate]);

  // ✅ ADDED: Missing handleSiguiente function
  const handleSiguiente = () => {
    if (scanSuccess && huellaVerificada) {
      setMostrarModal(true);
      setTimeout(() => {
        setMostrarModal(false);
        // Navigate to the next step - book selection or loan creation
        navigate('/Confirmar_Prestamo'); // or whatever your next step is
      }, 1500);
    }
  };

  // ✅ CORRECTED: Función para verificar huella dactilar con biblioteca_id
  const handleScanFingerprint = async () => {
    if (!usuarioData || !usuarioData.user_id) {
      setError('No se encontraron datos del usuario');
      return;
    }

    if (!bibliotecaId) {
      setError('ID de biblioteca no encontrado. Por favor inicia sesión nuevamente.');
      return;
    }

    try {
      setIsScanning(true);
      setError('');
      console.log('🔍 Iniciando verificación de huella dactilar para usuario:', usuarioData.user_id, 'en biblioteca:', bibliotecaId);

      const huellaEscaneada = "huella_temp_placeholder";

      const response = await fetchWithAuth('/api/business/verificar-huella', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: parseInt(usuarioData.user_id),
          biblioteca_id: parseInt(bibliotecaId),
          huella_escaneada: huellaEscaneada
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'Huella verificada') {
        console.log('✅ Huella verificada exitosamente:', data);
        
        // ✅ IMPROVED: Better data combination with API response
        const datosCompletos = {
          ...usuarioData,
          user_id: data.data.user_id, // Use the confirmed user_id from API
          usuario_nombre: data.data.usuario_nombre, // Use confirmed name from API
          usuario_apellido: data.data.usuario_apellido, // Use confirmed surname from API
          biblioteca_id: data.data.biblioteca_id,
          verificacion_biometrica_completa: true,
          verificacion_exitosa: data.data.verificacion_exitosa,
          verification_details: data.data.verification_details,
          // Keep original RFID data
          codigo_tarjeta: usuarioData.codigo_tarjeta,
          biblioteca_nombre: usuarioData.biblioteca_nombre
        };
        
        // Guardar datos completos para el préstamo
        localStorage.setItem('usuario_prestamo_verificado', JSON.stringify(datosCompletos));
        
        // ✅ IMPROVED: Show verification details
        setHuellaVerificada({
          ...data.data,
          confidence_score: data.data.verification_details?.confidence_score || 100,
          slot_id: data.data.verification_details?.slot_id
        });
        setScanSuccess(true);
        setError('');

        console.log('📄 Datos completos guardados para préstamo:', datosCompletos);

      } else {
        // Manejar diferentes tipos de errores
        let errorMessage = data.msg || 'Error al verificar huella dactilar';
        
        switch (data.code) {
          case 'HUELLA_01':
            errorMessage = 'Usuario no encontrado';
            break;
          case 'HUELLA_02':
            errorMessage = 'El usuario no tiene huella dactilar registrada';
            break;
          case 'HUELLA_03':
            errorMessage = 'La huella dactilar no coincide';
            break;
          case 'HUELLA_04':
            errorMessage = 'Error de comunicación con el dispositivo de huella';
            break;
          case 'HUELLA_05':
            errorMessage = 'Datos requeridos faltantes para la verificación';
            break;
          default:
            errorMessage = data.msg || 'Error desconocido al verificar huella';
        }
        
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('❌ Error verificando huella dactilar:', error);
      setError(error.message || 'Error al conectar con el dispositivo de huella dactilar');
      setScanSuccess(false);
      setHuellaVerificada(null);
    } finally {
      setIsScanning(false);
    }
  };

  // ✅ ADDED: Early return if no biblioteca_id found
  if (!bibliotecaId) {
    return (
      <div className="buscar-libros-bg">
        <Sidebar />
        <div className="buscar-libros-content">
          <h1 className="nuevo-prestamo-title">Nuevo préstamo</h1>
          <div className="buscar-divider">
            <svg xmlns="http://www.w3.org/2000/svg" width="859.012" height="4" viewBox="0 0 860 4" fill="none">
              <path d="M0 2L859.012 2" stroke="#3A332A" strokeWidth="3" />
            </svg>
          </div>
          
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
              Ir al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar loading si no hay datos del usuario
  if (!usuarioData) {
    return (
      <div className="buscar-libros-bg">
        <Sidebar />
        <div className="buscar-libros-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div>Cargando datos del usuario...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="buscar-libros-bg">
      <Sidebar />
      <div className="buscar-libros-content">
        <h1 className="nuevo-prestamo-title">Nuevo préstamo</h1>
        <div className="buscar-divider">
          <svg xmlns="http://www.w3.org/2000/svg" width="859.012" height="4" viewBox="0 0 860 4" fill="none">
            <path d="M0 2L859.012 2" stroke="#3A332A" strokeWidth="3" />
          </svg>
        </div>
        
        <div className="escanear-tarjeta-card">
          <div className="escanear-tarjeta-titulo">
            A continuación, valide los <br /> datos del usuario por medio <br /> de su huella digital
          </div>

          {/* Mostrar información del usuario */}
          <div style={{
            margin: '15px 0',
            padding: '12px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: '600', color: '#1E293B', marginBottom: '3px' }}>
              {usuarioData.usuario_nombre} {usuarioData.usuario_apellido}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Tarjeta: {usuarioData.codigo_tarjeta}
            </div>
          </div>
          
          <div 
            className="escanear-tarjeta-svg-card" 
            onClick={!isScanning && !scanSuccess ? handleScanFingerprint : undefined}
            style={{
              cursor: (!isScanning && !scanSuccess) ? 'pointer' : 'default',
              backgroundColor: scanSuccess ? '#10B981' : (isScanning ? '#9CA3AF' : undefined),
              opacity: isScanning ? 0.7 : 1
            }}
          >
            {scanSuccess ? (
              // Checkmark de éxito
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#10B981"/>
                <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              // Icono de huella original
              <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" fill="none">
                <path d="M43.75 100V71.0096C43.75 67.8236 44.3766 64.7652 45.5282 61.9231M106.25 100V80.0962M57.6389 48.3404C62.6045 45.4409 68.5759 43.75 75 43.75C89.2469 43.75 101.267 52.0664 105.029 63.4375" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M62.5 106.25V92.6471M87.5 106.25V74.0809C87.5 67.6849 81.9036 62.5 75 62.5C68.0964 62.5 62.5 67.6849 62.5 74.0809V79.0441" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M37.5 18.75H18.75V37.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M112.5 18.75H131.25V37.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M37.5 131.25H18.75V112.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M112.5 131.25H131.25V112.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>

          {/* Mostrar información de verificación exitosa */}
          {huellaVerificada && (
            <div style={{
              margin: '15px 0',
              padding: '15px',
              backgroundColor: '#F0FDF4',
              border: '1px solid #10B981',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: '600', color: '#065F46', marginBottom: '5px' }}>
                ✅ Huella verificada exitosamente
              </div>
              <div style={{ fontSize: '13px', color: '#059669', marginBottom: '3px' }}>
                Puntuación: {huellaVerificada.confidence_score || 100}
              </div>
              {huellaVerificada.slot_id && (
                <div style={{ fontSize: '11px', color: '#047857' }}>
                  Slot: {huellaVerificada.slot_id}
                </div>
              )}
            </div>
          )}

          {/* Estados de carga y error */}
          {isScanning && (
            <div style={{
              color: '#3B82F6',
              fontSize: '14px',
              textAlign: 'center',
              margin: '15px 0',
              fontWeight: '500'
            }}>
              🔍 Verificando huella dactilar...
            </div>
          )}

          {error && (
            <div style={{
              color: '#dc2626',
              fontSize: '13px',
              textAlign: 'center',
              margin: '15px 0',
              fontWeight: '500',
              backgroundColor: '#FEF2F2',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #FCA5A5'
            }}>
              ❌ {error}
            </div>
          )}

          {/* Botón de acción - VERDE */}
          {!scanSuccess && !isScanning && (
            <button
              className="escanear-tarjeta-siguiente-btn"
              onClick={handleScanFingerprint}
              style={{
                backgroundColor: '#2F5232', // Verde
                marginTop: '10px'
              }}
            >
              Verificar Huella
            </button>
          )}

          {/* Botón siguiente - VERDE */}
          {scanSuccess && (
            <button
              className="escanear-tarjeta-siguiente-btn"
              onClick={handleSiguiente}
              style={{
                backgroundColor: '#2F5232' // Verde
              }}
            >
              Siguiente
            </button>
          )}

          {/* Botón para reintentar en caso de error - CAFÉ */}
          {error && !isScanning && (
            <button
              onClick={handleScanFingerprint}
              style={{
                backgroundColor: '#453726', // Café/marrón
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Reintentar
            </button>
          )}

          {mostrarModal && (
            <PantallaTransicion
              icono={logo1}
              soloIcono={true}
              onClose={() => setMostrarModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Escanear_Huella_Usuario;
