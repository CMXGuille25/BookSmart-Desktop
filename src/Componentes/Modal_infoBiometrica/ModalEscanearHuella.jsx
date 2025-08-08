import React from 'react';
import './infoBiometrica.css';

const ModalEscanearHuella = ({ onClose }) => (
  <div className="modal-info-biometrica-overlay">
    <div className="modal-info-biometrica">
      <h2 className="modal-info-biometrica-titulo">Lectura de Huella</h2>
      <div className="modal-info-biometrica-cuadro-marron">
        <svg xmlns="http://www.w3.org/2000/svg" width="151" height="150" viewBox="0 0 151 150" fill="none">
            <path d="M44.25 21.9722C53.1881 15.9892 63.9366 12.5 75.5 12.5C101.144 12.5 122.781 29.6607 129.551 53.125" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M131.75 137.5V87.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.25 137.5V68.75C19.25 62.1756 20.3779 55.8646 22.4507 50" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M113 137.5V70.625C113 48.8788 96.2107 31.25 75.5 31.25C54.7893 31.25 38 48.8788 38 70.625V87.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M38 137.5V112.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M56.75 137.5V69.6875C56.75 58.8144 65.1447 50 75.5 50C80.9081 50 85.7814 52.4041 89.2035 56.25" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M94.25 137.5V87.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M75.5 137.5V115.625" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M75.5 68.75V87.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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

export default ModalEscanearHuella;
