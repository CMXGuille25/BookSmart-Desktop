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
              <div className="escanear-tarjeta-titulo">Escanea la tarjeta del<br />usuario</div>
              <div className="escanear-tarjeta-svg-card" onClick={handleScanCard} style={{cursor: 'pointer'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" fill="none">
                  <path d="M137.5 56.25V33.25C137.5 32.1454 136.605 31.25 135.5 31.25H14.5C13.3954 31.25 12.5 32.1454 12.5 33.25V116.75C12.5 117.855 13.3954 118.75 14.5 118.75H87.5M137.5 56.25H37.5M137.5 56.25V81.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M132.292 115.625H136.9C137.231 115.625 137.5 115.894 137.5 116.225V136.9C137.5 137.231 137.231 137.5 136.9 137.5H106.85C106.519 137.5 106.25 137.231 106.25 136.9V116.225C106.25 115.894 106.519 115.625 106.85 115.625H111.458M132.292 115.625V104.688C132.292 101.042 130.208 93.75 121.875 93.75C113.542 93.75 111.458 101.042 111.458 104.688V115.625M132.292 115.625H111.458" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <button
                className="escanear-tarjeta-siguiente-btn"
                onClick={() => {
                  setMostrarModal(true);
                  setTimeout(() => {
                    setMostrarModal(false);
                    navigate('/detalle-prestamo');
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
