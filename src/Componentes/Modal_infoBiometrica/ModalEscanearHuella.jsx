import { useState } from 'react';
import { fetchWithAuth } from '../../utils/auth.js';
import './infoBiometrica.css';

const ModalEscanearHuella = ({ onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [huellaData, setHuellaData] = useState(null);

  const handleDetectarHuella = async () => {
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

      // Call the fingerprint detection endpoint
      const response = await fetchWithAuth('/api/business/detectar-huella', {
        method: 'POST',
        body: JSON.stringify({
          usuario_id: parseInt(usuarioId),
          biblioteca_id: parseInt(bibliotecaId)
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'Captura exitosa') {
        console.log('✅ Huella registrada exitosamente:', data);
        const huellaInfo = {
          finger_id: data.data.finger_id,
          template_data: data.data.template_data,
          usuario_id: data.data.usuario_id,
          datos_adicional_id: data.data.datos_adicional_id,
          timestamp: new Date().toISOString()
        };
        
        setHuellaData(huellaInfo);
        setSuccess(true);
        
        // Close modal after a short delay and notify parent of success
        setTimeout(() => {
          onClose && onClose(true, huellaInfo);
        }, 1500);
      } else {
        throw new Error(data.msg || 'Error al registrar huella');
      }

    } catch (error) {
      console.error('❌ Error registrando huella:', error);
      setError(error.message || 'Error al conectar con el dispositivo de huella');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCancel = () => {
    onClose && onClose(false, null);
  };

  return (
    <div className="modal-info-biometrica-overlay">
      <div className="modal-info-biometrica">
        <h2 className="modal-info-biometrica-titulo">Lectura de Huella</h2>
        
        <div className="modal-info-biometrica-cuadro-marron">
          {success ? (
            // Success checkmark
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#10B981"/>
              <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            // Fingerprint icon
            <svg xmlns="http://www.w3.org/2000/svg" width="151" height="150" viewBox="0 0 151 150" fill="none">
              <path d="M44.25 21.9722C53.1881 15.9892 63.9366 12.5 75.5 12.5C101.144 12.5 122.781 29.6607 129.551 53.125" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M131.75 137.5V87.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.25 137.5V68.75C19.25 62.1756 20.3779 55.8646 22.4507 50" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M113 137.5V70.625C113 48.8788 96.2107 31.25 75.5 31.25C54.7893 31.25 38 48.8788 38 70.625V87.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M38 137.5V112.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M56.75 137.5V69.6875C56.75 58.8144 65.1447 50 75.5 50C80.9081 50 85.7814 52.4041 89.2035 56.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M94.25 137.5V87.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M75.5 137.5V115.625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M75.5 68.75V87.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
            Detectando huella dactilar...
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
            ¡Huella detectada exitosamente!
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
            onClick={handleDetectarHuella}
            disabled={isScanning}
            style={{
              backgroundColor: isScanning ? '#9CA3AF' : undefined,
              cursor: isScanning ? 'not-allowed' : 'pointer'
            }}
          >
            <span className="modal-info-biometrica-iniciar-btn-text">
              {isScanning ? 'Detectando...' : 'Iniciar'}
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

export default ModalEscanearHuella;
