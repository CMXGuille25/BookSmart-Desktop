import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const ConfirmLogin = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Verificar datos temporales
  const pendingUser = JSON.parse(localStorage.getItem('pending_user') || '{}');
  const tempToken = localStorage.getItem('temp_token');
  if (!pendingUser.id || !tempToken) {
    navigate('/Inicio');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Type': 'desktop',
        },
        body: JSON.stringify({ '2fa': code, "user_id": pendingUser.id }),
      });
      const data = await response.json();
      if (response.status === 200 && data.data && data.data.token) {
        // 👇 Aquí se muestra el token JWT final en la consola
        console.log('✅ JWT recibido:', data.data.token);
        
        localStorage.removeItem('temp_token');
        localStorage.removeItem('pending_user');
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('camera_allowed', 'true'); // Guardar estado de cámara
        navigate('/Inicio');
      } else {
        switch (response.status) {
          case 401:
            setError('Código de verificación incorrecto');
            break;
          case 422:
            setError('Formato de código inválido');
            break;
          case 500:
            setError('Error del servidor. Intenta más tarde');
            break;
          default:
            setError(data.msg || 'Error de verificación');
        }
      }
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('No se puede conectar al servidor. Verifica que la API esté ejecutándose en http://localhost:3333');
      } else {
        setError('Error de conexión. Intenta de nuevo.');
      }
      console.error('Error en verificación 2FA:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <h2 className="confirm-title">Confirma tu inicio de sesión</h2>
          <p className="confirm-instruction">
            Ingresa el código que enviamos a tu correo
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '6px',
              padding: '8px 12px',
              margin: '10px 0',
              fontSize: '12px',
              textAlign: 'center',
              color: '#856404'
            }}>
              <strong>Código de prueba:</strong> ABCD1234EFGH5678
            </div>
          )}
          <form onSubmit={handleSubmit} className="confirm-form">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="confirm-code-input"
              disabled={loading}
              maxLength={20}
            />
            {error && (
              <div
                className="login-error"
                style={{
                  color: '#000',
                  background: '#ffeaea',
                  border: '1px solid #ffb3b3',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  margin: '10px 0',
                  fontWeight: '500',
                  textAlign: 'center',
                  boxShadow: '0 1px 4px rgba(255,0,0,0.08)'
                }}
              >
                {error}
              </div>
            )}
            <button type="submit" className="confirm-button" disabled={loading}>
              {loading ? 'Verificando...' : 'Validar código'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogin;