import React from 'react';
import './infoBiometrica.css';

const ModalEscanearRostro = ({ onClose }) => (
  <div className="modal-info-biometrica-overlay">
    <div className="modal-info-biometrica">
      <h2 className="modal-info-biometrica-titulo">Tomar foto</h2>
      <div className="modal-info-biometrica-cuadro-marron">
        <svg xmlns="http://www.w3.org/2000/svg" width="113" height="113" viewBox="0 0 113 113" fill="none">
            <path d="M9.4165 96.875V34.9583C9.4165 33.8538 10.3119 32.9583 11.4165 32.9583H24.8957C25.5252 32.9583 26.118 32.6619 26.4957 32.1583L39.8407 14.365C39.954 14.2139 40.1318 14.125 40.3207 14.125H72.679C72.8679 14.125 73.0457 14.2139 73.159 14.365L86.504 32.1583C86.8817 32.6619 87.4745 32.9583 88.104 32.9583H101.583C102.688 32.9583 103.583 33.8538 103.583 34.9583V96.875C103.583 97.9796 102.688 98.875 101.583 98.875H11.4165C10.3119 98.875 9.4165 97.9796 9.4165 96.875Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M56.4998 80.0417C66.9012 80.0417 75.3332 71.6097 75.3332 61.2083C75.3332 50.807 66.9012 42.375 56.4998 42.375C46.0985 42.375 37.6665 50.807 37.6665 61.2083C37.6665 71.6097 46.0985 80.0417 56.4998 80.0417Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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

export default ModalEscanearRostro;
