import React, { useState } from 'react';
import PantallaTransicion from '../Componentes/PantallaTransicion/PantallaTransicion';
import logo1 from '../assets/logo1.png';
import { useNavigate } from 'react-router-dom';
import './Escanear_Usuario.css';
import Sidebar from '../Componentes/Sidebar/Sidebar';


const Escanear_Tarjeta_Usuario = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  // Evento para escanear la tarjeta
  const handleScanCard = () => {
    // Aquí irá la lógica de escaneo
    // Por ahora solo es un placeholder
    console.log('Escanear tarjeta');
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
              <div className="escanear-tarjeta-titulo">A continuación, valide los <br /> datos del usuario por medio <br /> de su huella digital</div>
              <div className="escanear-tarjeta-svg-card" onClick={handleScanCard} style={{cursor: 'pointer'}}>
               <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" fill="none">
                    <path d="M43.75 100V71.0096C43.75 67.8236 44.3766 64.7652 45.5282 61.9231M106.25 100V80.0962M57.6389 48.3404C62.6045 45.4409 68.5759 43.75 75 43.75C89.2469 43.75 101.267 52.0664 105.029 63.4375" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M62.5 106.25V92.6471M87.5 106.25V74.0809C87.5 67.6849 81.9036 62.5 75 62.5C68.0964 62.5 62.5 67.6849 62.5 74.0809V79.0441" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M37.5 18.75H18.75V37.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M112.5 18.75H131.25V37.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M37.5 131.25H18.75V112.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M112.5 131.25H131.25V112.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <button
                className="escanear-tarjeta-siguiente-btn"
                onClick={() => {
                  setMostrarModal(true);
                  setTimeout(() => {
                    setMostrarModal(false);
                    navigate('/Confirmar_Prestamo');
                  }, 1000);
                }}
              >
                Siguiente
              </button>
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
