import React from 'react';
import './infoBiometrica.css';

const ModalEscanearTarjeta = ({ onClose }) => (
  <div className="modal-info-biometrica-overlay">
    <div className="modal-info-biometrica">
      <h2 className="modal-info-biometrica-titulo">Escanear Tarjeta</h2>
      <div className="modal-info-biometrica-cuadro-marron">
        <svg xmlns="http://www.w3.org/2000/svg" width="151" height="150" viewBox="0 0 151 150" fill="none">
            <path d="M138 56.25V33.25C138 32.1454 137.105 31.25 136 31.25H15C13.8954 31.25 13 32.1454 13 33.25V116.75C13 117.855 13.8954 118.75 15 118.75H88M138 56.25H38M138 56.25V81.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M132.792 115.625H137.4C137.731 115.625 138 115.894 138 116.225V136.9C138 137.231 137.731 137.5 137.4 137.5H107.35C107.019 137.5 106.75 137.231 106.75 136.9V116.225C106.75 115.894 107.019 115.625 107.35 115.625H111.958M132.792 115.625V104.688C132.792 101.042 130.708 93.75 122.375 93.75C114.042 93.75 111.958 101.042 111.958 104.688V115.625M132.792 115.625H111.958" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <button
        className="modal-info-biometrica-iniciar-btn"
        onClick={() => onClose && onClose(true)}
      >
        <span className="modal-info-biometrica-iniciar-btn-text">Iniciar</span>
      </button>
    </div>
  </div>
);

export default ModalEscanearTarjeta;
