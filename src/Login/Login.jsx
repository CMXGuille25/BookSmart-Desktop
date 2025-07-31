import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo1.png';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3333/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Type': 'desktop', // Identificar cliente desktop
        },
        body: JSON.stringify({
          correo: email,        
          contraseña: password, 
        }),
      });
      
      const data = await response.json();
      
      // ✅ Manejo específico de códigos de respuesta de la API
      if (response.status === 200 && data.data && data.status === "Inicio de sesión exitoso") {
        // ✅ 2FA requerido - Paso 1 completado (credenciales correctas)
        // ✅ Validación de rol: Solo bibliotecarios en aplicación desktop
        if (data.data.user.rol !== 'Bibliotecario') {
          setError('Esta aplicación es solo para bibliotecarios. Tu rol actual es: ' + data.data.user.rol);
          return;
        }

        // ✅ Guardar datos temporales para el paso 2 (NO el token final)
        localStorage.setItem('temp_token', data.data.token.token);
        localStorage.setItem('pending_user', JSON.stringify(data.data.user));
        
        console.log('Login inicial exitoso - 2FA requerido:', {
          nombre: data.data.user.nombre,
          rol: data.data.user.rol,
          status: data.status
        });
        
        // ✅ Ir al paso 2: verificación 2FA (aquí es donde ingresas el código)
        navigate('/ConfirmarLogin');
        
      } else {
        // ✅ Manejo específico de errores de la API Booksmart
        let errorId = '';
        switch (response.status) {
          case 401:
            errorId = 'AUTH_01';
            setError('Usuario o contraseña incorrectos');
            break;
          case 404:
            errorId = 'AUTH_02';
            setError('Usuario o contraseña incorrectos');
            break;
          case 422:
            errorId = 'AUTH_03';
            setError('Formato de datos inválido');
            break;
          case 500:
            setError('Error del servidor. Intenta más tarde');
            return;
          default:
            setError(data.msg || 'Error de autenticación');
        }
        if (errorId) {
          console.warn('Código de error login:', errorId);
        }
      }
      
    } catch (err) {
      // ✅ Manejo mejorado de errores de conexión
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('No se puede conectar al servidor. Verifica que la API esté ejecutándose en http://localhost:3333');
      } else {
        setError('Error de conexión. Intenta de nuevo.');
      }
      console.error('Error de login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <img src={logo} alt="Logo BookSmart" className="login-logo" />
          <p className="login-subtitle">Inicie sesión para continuar</p>
          
          {/* ✅ Mensaje informativo para desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{
              background: '#e3f2fd',
              border: '1px solid #2196f3',
              borderRadius: '6px',
              padding: '8px 12px',
              margin: '10px 0',
              fontSize: '12px',
              textAlign: 'center',
              color: '#1976d2'
            }}>
              <strong>Credenciales de prueba:</strong><br/>
              bibliotecario.desktop@test.com / Password123!
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@biblioteca.com"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group password-group">
              <label>Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                disabled={loading}
              />
              {password.length > 0 && (
                <span
                  className="eye-icon"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  tabIndex={0}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  role="button"
                >
                  <svg width="40" height="41" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                    <path d="M3 13C6.6 5 17.4 5 21 13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </span>
              )}
            </div>
            {error && (
              <div
                className="login-error"
                style={{
                  color: '#000',
                  background: '#ffeaea',
                  border: '1px solid #ffb3b3',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  margin: '-4px 0 -2px 0',
                  fontWeight: '500',
                  textAlign: 'center',
                  boxShadow: '0 1px 4px rgba(255,0,0,0.08)'
                }}
              >
                {error}
              </div>
            )}
            <p className="no-account">
              <a href="mailto:admin@tudominio.com" className="no-account-link">
                ¿No tienes una cuenta?
              </a>
              Contacta a tu administrador
            </p>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
            <style>{`
              .login-button { margin-top: -30px !important; }
            `}</style>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
