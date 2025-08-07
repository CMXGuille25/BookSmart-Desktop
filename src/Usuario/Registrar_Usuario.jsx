
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PantallaTransicion from '../Componentes/PantallaTransicion/PantallaTransicion.jsx';
import logo1 from '../assets/logo1.png';
import './Usuario.css';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';
import ModalEscanearRostro from '../Componentes/Modal_InfoBiometrica/ModalEscanearRostro.jsx';
import ModalEscanearHuella from '../Componentes/Modal_InfoBiometrica/ModalEscanearHuella.jsx';
import ModalEscanearTarjeta from '../Componentes/Modal_InfoBiometrica/ModalEscanearTarjeta.jsx';


const RegistrarUsuario = () => {
  const navigate = useNavigate();
  // Estado para modales y registro de biométricos
  const [transicion, setTransicion] = useState(false);
  const [modalRostroOpen, setModalRostroOpen] = useState(false);
  const [modalHuellaOpen, setModalHuellaOpen] = useState(false);
  const [modalTarjetaOpen, setModalTarjetaOpen] = useState(false);
  const [rostroRegistrado, setRostroRegistrado] = useState(false);
  const [huellaRegistrada, setHuellaRegistrada] = useState(false);
  const [tarjetaRegistrada, setTarjetaRegistrada] = useState(false);

  // Habilitar botón solo si los tres están registrados
  const registroCompleto = rostroRegistrado && huellaRegistrada && tarjetaRegistrada;

  // Handlers para abrir modales
  const handleAbrirModalRostro = () => setModalRostroOpen(true);
  const handleAbrirModalHuella = () => setModalHuellaOpen(true);
  const handleAbrirModalTarjeta = () => setModalTarjetaOpen(true);

  // Handlers para cerrar modales y marcar como registrado
  const handleCerrarModalRostro = (registrado) => {
    setModalRostroOpen(false);
    if (registrado) setRostroRegistrado(true);
  };
  const handleCerrarModalHuella = (registrado) => {
    setModalHuellaOpen(false);
    if (registrado) setHuellaRegistrada(true);
  };
  const handleCerrarModalTarjeta = (registrado) => {
    setModalTarjetaOpen(false);
    if (registrado) setTarjetaRegistrada(true);
  };

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
              <div className="usuario-editar-info-card">
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Nombre:</span>
                  <span className="usuario-editar-info-value">Defnom</span>
                </div>
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Apellidos:</span>
                  <span className="usuario-editar-info-value">Defape</span>
                </div>
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Correo:</span>
                  <span className="usuario-editar-info-value">DefCorreo</span>
                </div>
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Número:</span>
                  <span className="usuario-editar-info-value">Defnum</span>
                </div>
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Género:</span>
                  <span className="usuario-editar-info-value">Defgen</span>
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
                    setTransicion(true);
                    setTimeout(() => {
                      navigate('/Usuarios');
                    }, 1200); // 1.2 segundos de transición
                  }
                }}
              >
                Finalizar registro
              </button>
            </div>
          </div>
          {/* Tres recuadros pequeños uno sobre otro, lado derecho */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginLeft: '30px' }}>
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
                style={{ backgroundColor: rostroRegistrado ? '#3CB371' : '#3B82F6', color: 'white' }}
                onClick={handleAbrirModalRostro}
                disabled={rostroRegistrado}
              >
                {rostroRegistrado ? 'Registrado' : 'Registrar'}
              </button>
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
                style={{ backgroundColor: huellaRegistrada ? '#3CB371' : '#3B82F6', color: 'white' }}
                onClick={handleAbrirModalHuella}
                disabled={huellaRegistrada}
              >
                {huellaRegistrada ? 'Registrado' : 'Registrar'}
              </button>
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
                style={{ backgroundColor: tarjetaRegistrada ? '#3CB371' : '#3B82F6', color: 'white' }}
                onClick={handleAbrirModalTarjeta}
                disabled={tarjetaRegistrada}
              >
                {tarjetaRegistrada ? 'Registrado' : 'Registrar'}
              </button>
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
