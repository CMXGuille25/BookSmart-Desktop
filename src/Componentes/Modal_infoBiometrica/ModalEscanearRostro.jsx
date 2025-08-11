import { useRef, useState } from 'react';
import './infoBiometrica.css';

const ModalEscanearRostro = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Por favor selecciona una imagen válida (JPG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    try {
      setError('');
      
      // Convert to base64
      const base64 = await convertToBase64(file);
      setSelectedImage(base64);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Error al procesar la imagen');
    }
  };

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Handle upload
  const handleUpload = () => {
    if (selectedImage) {
      setUploading(true);
      // Close modal and pass the base64 image to parent
      onClose(true, selectedImage);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Clean up preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    onClose(false);
  };

  return (
    <div className="modal-info-biometrica-overlay">
      <div className="modal-info-biometrica">
        <h2 className="modal-info-biometrica-titulo">Subir foto</h2>
        
        {/* Brown box that shows either camera icon or selected image */}
        <div className="modal-info-biometrica-cuadro-marron">
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="113" height="113" viewBox="0 0 113 113" fill="none">
              <path d="M9.4165 96.875V34.9583C9.4165 33.8538 10.3119 32.9583 11.4165 32.9583H24.8957C25.5252 32.9583 26.118 32.6619 26.4957 32.1583L39.8407 14.365C39.954 14.2139 40.1318 14.125 40.3207 14.125H72.679C72.8679 14.125 73.0457 14.2139 73.159 14.365L86.504 32.1583C86.8817 32.6619 87.4745 32.9583 88.104 32.9583H101.583C102.688 32.9583 103.583 33.8538 103.583 34.9583V96.875C103.583 97.9796 102.688 98.875 101.583 98.875H11.4165C10.3119 98.875 9.4165 97.9796 9.4165 96.875Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M56.4998 80.0417C66.9012 80.0417 75.3332 71.6097 75.3332 61.2083C75.3332 50.807 66.9012 42.375 56.4998 42.375C46.0985 42.375 37.6665 50.807 37.6665 61.2083C37.6665 71.6097 46.0985 80.0417 56.4998 80.0417Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            color: '#dc2626',
            fontSize: '12px',
            marginTop: '10px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {/* Button section */}
        <div className="modal-info-biometrica-footer">
          {!selectedImage ? (
            <button 
              className="modal-info-biometrica-iniciar-btn"
              onClick={openFilePicker}
            >
              <span className="modal-info-biometrica-iniciar-btn-text">Seleccionar imagen</span>
            </button>
          ) : (
            <button 
              className="modal-info-biometrica-iniciar-btn"
              onClick={handleUpload}
              disabled={uploading}
              style={{
                backgroundColor: uploading ? '#9CA3AF' : undefined,
                cursor: uploading ? 'not-allowed' : 'pointer'
              }}
            >
              <span className="modal-info-biometrica-iniciar-btn-text">
                {uploading ? 'Subiendo...' : 'Subir imagen'}
              </span>
            </button>
          )}
        </div>

        {/* Optional: Change image button when image is selected */}
        {selectedImage && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <button 
              onClick={openFilePicker}
              style={{
                background: 'none',
                border: 'none',
                color: '#6B7280',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Cambiar imagen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalEscanearRostro;
