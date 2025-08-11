import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalEscanearHuella from '../Componentes/Modal_InfoBiometrica/ModalEscanearHuella.jsx';
import ModalEscanearRostro from '../Componentes/Modal_InfoBiometrica/ModalEscanearRostro.jsx';
import ModalEscanearTarjeta from '../Componentes/Modal_InfoBiometrica/ModalEscanearTarjeta.jsx';
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

  // Estado para modales y registro de biométricos
  const [transicion, setTransicion] = useState(false);
  const [modalRostroOpen, setModalRostroOpen] = useState(false);
  const [modalHuellaOpen, setModalHuellaOpen] = useState(false);
  const [modalTarjetaOpen, setModalTarjetaOpen] = useState(false);
  const [rostroRegistrado, setRostroRegistrado] = useState(false);
  const [huellaRegistrada, setHuellaRegistrada] = useState(false);
  const [tarjetaRegistrada, setTarjetaRegistrada] = useState(false);

  // Estados para loading y errores
  const [loading, setLoading] = useState({
    rostro: false,
    huella: false,
    tarjeta: false
  });
  const [errors, setErrors] = useState({
    rostro: '',
    huella: '',
    tarjeta: ''
  });

  // Habilitar botón solo si los tres están registrados
  const registroCompleto = rostroRegistrado && huellaRegistrada && tarjetaRegistrada;

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

  // API Functions - Updated to include biblioteca_id
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

  const registrarHuella = async () => {
    try {
      setLoading(prev => ({ ...prev, huella: true }));
      setErrors(prev => ({ ...prev, huella: '' }));

      // Validate required data
      if (!bibliotecaId) {
        throw new Error('ID de biblioteca no encontrado. Por favor inicia sesión nuevamente.');
      }

      const response = await fetchWithAuth('/api/business/detectar-huella', {
        method: 'POST',
        body: JSON.stringify({
          usuario_id: parseInt(usuarioId),
          biblioteca_id: parseInt(bibliotecaId)
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'Registro exitoso') {
        console.log('✅ Huella registrada exitosamente:', data);
        setHuellaRegistrada(true);
        return { success: true, data };
      } else {
        throw new Error(data.msg || 'Error al registrar huella');
      }
    } catch (error) {
      console.error('❌ Error registrando huella:', error);
      setErrors(prev => ({ ...prev, huella: error.message }));
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, huella: false }));
    }
  };

  const registrarTarjeta = async () => {
    try {
      setLoading(prev => ({ ...prev, tarjeta: true }));
      setErrors(prev => ({ ...prev, tarjeta: '' }));

      // Validate required data
      if (!bibliotecaId) {
        throw new Error('ID de biblioteca no encontrado. Por favor inicia sesión nuevamente.');
      }

      const response = await fetchWithAuth('/api/business/registrar-rfid', {
        method: 'POST',
        body: JSON.stringify({
          usuario_id: parseInt(usuarioId),
          biblioteca_id: parseInt(bibliotecaId)
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'Registro exitoso') {
        console.log('✅ Tarjeta registrada exitosamente:', data);
        setTarjetaRegistrada(true);
        return { success: true, data };
      } else {
        throw new Error(data.msg || 'Error al registrar tarjeta');
      }
    } catch (error) {
      console.error('❌ Error registrando tarjeta:', error);
      setErrors(prev => ({ ...prev, tarjeta: error.message }));
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, tarjeta: false }));
    }
  };

  // Handlers para abrir modales
  const handleAbrirModalRostro = () => setModalRostroOpen(true);
  const handleAbrirModalHuella = () => setModalHuellaOpen(true);
  const handleAbrirModalTarjeta = () => setModalTarjetaOpen(true);

  // Handlers para cerrar modales y registrar
  const handleCerrarModalRostro = async (registrado, imagenBase64) => {
    setModalRostroOpen(false);
    if (registrado && imagenBase64) {
      const result = await registrarRostro(imagenBase64);
      if (!result.success) {
        alert(`Error al registrar rostro: ${result.error}`);
      }
    }
  };

  const handleCerrarModalHuella = async (registrado) => {
    setModalHuellaOpen(false);
    if (registrado) {
      const result = await registrarHuella();
      if (!result.success) {
        alert(`Error al registrar huella: ${result.error}`);
      }
    }
  };

  const handleCerrarModalTarjeta = async (registrado) => {
    setModalTarjetaOpen(false);
    if (registrado) {
      const result = await registrarTarjeta();
      if (!result.success) {
        alert(`Error al registrar tarjeta: ${result.error}`);
      }
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
              
              <button
                className="usuario-finalizar-registro-btn"
                disabled={!registroCompleto}
                style={{
                  backgroundColor: registroCompleto ? '#2F5232' : '#BDBDBD',
                  color: registroCompleto ? 'white' : '#757575',
                  cursor: registroCompleto ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s',
                }}
                onClick={() => {
                  if (registroCompleto) {
                    localStorage.removeItem('usuario_registro_temp');
                    setTransicion(true);
                    setTimeout(() => {
                      navigate('/Usuarios');
                    }, 1200);
                  }
                }}
              >
                Finalizar registro
              </button>
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
                  backgroundColor: rostroRegistrado ? '#3CB371' : '#3B82F6', 
                  color: 'white',
                  opacity: loading.rostro ? 0.7 : 1
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
                  backgroundColor: huellaRegistrada ? '#3CB371' : '#3B82F6', 
                  color: 'white',
                  opacity: loading.huella ? 0.7 : 1
                }}
                onClick={handleAbrirModalHuella}
                disabled={huellaRegistrada || loading.huella}
              >
                {loading.huella ? 'Registrando...' : (huellaRegistrada ? 'Registrado' : 'Registrar')}
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
                  backgroundColor: tarjetaRegistrada ? '#3CB371' : '#3B82F6', 
                  color: 'white',
                  opacity: loading.tarjeta ? 0.7 : 1
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
