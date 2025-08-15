import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PantallaTransicion from '../Componentes/PantallaTransicion/PantallaTransicion';
import Sidebar from '../Componentes/Sidebar/Sidebar';
import logo1 from '../assets/logo1.png';
import { fetchWithAuth } from '../utils/auth.js';
import './Escanear_Usuario.css';

const Escanear_Tarjeta_Usuario = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [usuarioVerificado, setUsuarioVerificado] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const navigate = useNavigate();

  // Función para verificar tarjeta RFID
  const handleScanCard = async () => {
    try {
      setIsScanning(true);
      setError('');
      console.log('🔍 Iniciando verificación de tarjeta RFID...');

      // Llamar al endpoint de verificación RFID
      const response = await fetchWithAuth('/api/business/verificar-rfid', {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok && data.status === 'RFID verificado') {
        console.log('✅ Tarjeta RFID verificada exitosamente:', data);
        
        // Guardar datos del usuario para el siguiente paso
        localStorage.setItem('usuario_prestamo_temp', JSON.stringify(data.data));
        
        setUsuarioVerificado(data.data);
        setScanSuccess(true);
        setError('');

      } else {
        // Manejar diferentes tipos de errores
        let errorMessage = data.msg || 'Error al verificar tarjeta RFID';
        
        switch (data.code) {
          case 'RFID_01':
            errorMessage = 'Tarjeta RFID no registrada en el sistema';
            break;
          case 'RFID_02':
            errorMessage = 'El usuario no está registrado en esta biblioteca';
            break;
          case 'RFID_03':
            errorMessage = 'El usuario no tiene huella dactilar registrada';
            break;
          case 'RFID_05':
          case 'RFID_08':
            errorMessage = 'Error de comunicación con el dispositivo RFID';
            break;
          default:
            errorMessage = data.msg || 'Error desconocido al verificar tarjeta';
        }
        
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('❌ Error verificando tarjeta RFID:', error);
      setError(error.message || 'Error al conectar con el dispositivo RFID');
      setScanSuccess(false);
      setUsuarioVerificado(null);
    } finally {
      setIsScanning(false);
    }
  };

  // Función para continuar al siguiente paso
  const handleSiguiente = () => {
    if (usuarioVerificado) {
      setMostrarModal(true);
      setTimeout(() => {
        setMostrarModal(false);
        navigate('/Escanear_Huella_Usuario');
      }, 1000);
    }
  };

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
            Escanea la tarjeta del<br />usuario
          </div>
          
          <div 
            className="escanear-tarjeta-svg-card" 
            onClick={!isScanning && !scanSuccess ? handleScanCard : undefined}
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
              // Icono de tarjeta RFID original
              <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" fill="none">
                <path d="M137.5 56.25V33.25C137.5 32.1454 136.605 31.25 135.5 31.25H14.5C13.3954 31.25 12.5 32.1454 12.5 33.25V116.75C12.5 117.855 13.3954 118.75 14.5 118.75H87.5M137.5 56.25H37.5M137.5 56.25V81.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M132.292 115.625H136.9C137.231 115.625 137.5 115.894 137.5 116.225V136.9C137.5 137.231 137.231 137.5 136.9 137.5H106.85C106.519 137.5 106.25 137.231 106.25 136.9V116.225C106.25 115.894 106.519 115.625 106.85 115.625H111.458M132.292 115.625V104.688C132.292 101.042 130.208 93.75 121.875 93.75C113.542 93.75 111.458 101.042 111.458 104.688V115.625M132.292 115.625H111.458" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>

          {/* Mostrar información del usuario verificado */}
          {usuarioVerificado && (
            <div style={{
              margin: '15px 0',
              padding: '15px',
              backgroundColor: '#F0FDF4',
              border: '1px solid #10B981',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: '600', color: '#065F46', marginBottom: '5px' }}>
                ✅ Usuario verificado
              </div>
              <div style={{ fontSize: '14px', color: '#047857' }}>
                {usuarioVerificado.usuario_nombre} {usuarioVerificado.usuario_apellido}
              </div>
              <div style={{ fontSize: '12px', color: '#059669', marginTop: '3px' }}>
                {usuarioVerificado.biblioteca_nombre}
              </div>
            </div>
          )}

          {/* Estados de carga */}
          {isScanning && (
            <div style={{
              color: '#3B82F6',
              fontSize: '14px',
              textAlign: 'center',
              margin: '15px 0',
              fontWeight: '500'
            }}>
              🔍 Escaneando tarjeta RFID...
            </div>
          )}

          {/* Mensajes de error */}
          {error && (
            <div style={{
              color: '#dc2626',
              fontSize: '13px',
              textAlign: 'center',
              margin: '10px 0', // Margin más pequeño para error
              fontWeight: '500',
              backgroundColor: '#FEF2F2',
              padding: '8px', // Padding más pequeño
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
              onClick={handleScanCard}
              style={{
                backgroundColor: '#2F5232', // Verde
                marginTop: error ? '5px' : '10px' // Margin condicional
              }}
            >
              {error ? 'Reintentar' : 'Escanear Tarjeta'}
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

export default Escanear_Tarjeta_Usuario;
