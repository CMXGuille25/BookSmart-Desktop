import { useState } from 'react';
import { fetchWithAuth } from '../../utils/auth.js';
import './infoBiometrica.css';

const ModalEscanearTarjeta = ({ onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegistrarTarjeta = async () => {
    try {
      setIsScanning(true);
      setError('');

      // Get required data from localStorage
      const usuarioTemp = JSON.parse(localStorage.getItem('usuario_registro_temp') || '{}');
      const usuarioId = usuarioTemp.id || localStorage.getItem('usuario_id') || localStorage.getItem('user_id');
      const bibliotecaId = localStorage.getItem('biblioteca');

      if (!usuarioId) {
        throw new Error('ID de usuario no encontrado');
      }

      if (!bibliotecaId) {
        throw new Error('ID de biblioteca no encontrado');
      }

      // Call the RFID registration endpoint
      const response = await fetchWithAuth('/api/business/registrar-rfid', {
        method: 'POST',
        body: JSON.stringify({
          usuario_id: parseInt(usuarioId),
          biblioteca_id: parseInt(bibliotecaId)
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'Registro exitoso') {
        console.log('✅ Tarjeta RFID registrada exitosamente:', data);
        setSuccess(true);
        
        // Close modal after a short delay and notify parent of success
        setTimeout(() => {
          onClose && onClose(true);
        }, 1500);
      } else {
        throw new Error(data.msg || 'Error al registrar tarjeta RFID');
      }

    } catch (error) {
      console.error('❌ Error registrando tarjeta RFID:', error);
      setError(error.message || 'Error al conectar con el dispositivo RFID');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCancel = () => {
    onClose && onClose(false);
  };

  return (
    <div className="modal-info-biometrica-overlay">
      <div className="modal-info-biometrica">
        <h2 className="modal-info-biometrica-titulo">Escanear Tarjeta</h2>
        
        <div className="modal-info-biometrica-cuadro-marron">
          {success ? (
            // Success checkmark
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#10B981"/>
              <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            // RFID card icon
            <svg xmlns="http://www.w3.org/2000/svg" width="151" height="150" viewBox="0 0 151 150" fill="none">
              <path d="M138 56.25V33.25C138 32.1454 137.105 31.25 136 31.25H15C13.8954 31.25 13 32.1454 13 33.25V116.75C13 117.855 13.8954 118.75 15 118.75H88M138 56.25H38M138 56.25V81.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M132.792 115.625H137.4C137.731 115.625 138 115.894 138 116.225V136.9C138 137.231 137.731 137.5 137.4 137.5H107.35C107.019 137.5 106.75 137.231 106.75 136.9V116.225C106.75 115.894 107.019 115.625 107.35 115.625H111.958M132.792 115.625V104.688C132.792 101.042 130.708 93.75 122.375 93.75C114.042 93.75 111.958 101.042 111.958 104.688V115.625M132.792 115.625H111.958" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        {/* Status message */}
        {isScanning && (
          <div style={{
            color: '#3B82F6',
            fontSize: '14px',
            textAlign: 'center',
            marginTop: '10px',
            fontWeight: '500'
          }}>
            Esperando tarjeta RFID...
          </div>
        )}

        {success && (
          <div style={{
            color: '#10B981',
            fontSize: '14px',
            textAlign: 'center',
            marginTop: '10px',
            fontWeight: '500'
          }}>
            ¡Tarjeta registrada exitosamente!
          </div>
        )}

        {error && (
          <div style={{
            color: '#dc2626',
            fontSize: '12px',
            textAlign: 'center',
            marginTop: '10px',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        {/* Button */}
        {!success && (
          <button
            className="modal-info-biometrica-iniciar-btn"
            onClick={handleRegistrarTarjeta}
            disabled={isScanning}
            style={{
              backgroundColor: isScanning ? '#9CA3AF' : undefined,
              cursor: isScanning ? 'not-allowed' : 'pointer'
            }}
          >
            <span className="modal-info-biometrica-iniciar-btn-text">
              {isScanning ? 'Escaneando...' : 'Iniciar'}
            </span>
          </button>
        )}

        {/* Cancel button */}
        {!isScanning && !success && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <button 
              onClick={handleCancel}
              style={{
                background: 'none',
                border: 'none',
                color: '#6B7280',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalEscanearTarjeta;
