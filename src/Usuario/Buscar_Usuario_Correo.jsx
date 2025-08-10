import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';
import './Usuario.css';

const BuscarUsuarioEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState(null);

  // Get biblioteca_id from localStorage
  const bibliotecaId = localStorage.getItem('biblioteca');

  const buscarUsuarioPorEmail = async (emailBusqueda) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/business/buscar-usuario-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          email: emailBusqueda,
          biblioteca_id: parseInt(bibliotecaId)
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'Usuario encontrado') {
        console.log('✅ Usuario encontrado:', data);
        setUsuario(data.data);
        return { success: true, data: data.data };
      } else if (response.status === 404) {
        throw new Error('Usuario no encontrado o ya está registrado en esta biblioteca');
      } else if (response.status === 400) {
        throw new Error(data.msg || 'El usuario ya está registrado en esta biblioteca');
      } else {
        throw new Error(data.msg || 'Error al buscar usuario');
      }
    } catch (error) {
      console.error('❌ Error buscando usuario:', error);
      setError(error.message);
      setUsuario(null);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor ingrese un correo electrónico');
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor ingrese un correo electrónico válido');
      return;
    }

    await buscarUsuarioPorEmail(email.trim());
  };

  const handleProcederRegistro = () => {
    if (usuario) {
      // Store user data in localStorage for the registration page
      localStorage.setItem('usuario_registro_temp', JSON.stringify({
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        genero: usuario.genero
      }));
      
      // Navigate to biometric registration
      navigate('/Registrar_Usuario');
    }
  };

  const handleVolver = () => {
    navigate('/Usuarios');
  };

  return (
    <div className="usuario-editar-bg">
      <Sidebar />
      <main className="main-content">
        <h1 className="prestamos-title">Buscar Usuario</h1>
        <hr className="prestamos-divider" />
        
        <div className="usuario-editar-content-row">
          <div className="usuario-editar-card" style={{ height: '580px', width: '100%', maxWidth: '600px' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              height: '100%',
              padding: '40px',
              gap: '30px'
            }}>
              
              {/* Search Form */}
              <div style={{ width: '100%', textAlign: 'center' }}>
                <h2 style={{ color: '#453726', marginBottom: '20px', fontSize: '24px' }}>
                  Buscar Usuario por Correo
                </h2>
                <p style={{ color: '#453726', marginBottom: '30px', fontSize: '16px' }}>
                  Ingrese el correo del usuario que desea registrar en esta biblioteca
                </p>
                
                <form onSubmit={handleBuscar} style={{ width: '100%' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '16px',
                        border: '2px solid #E0E0E0',
                        borderRadius: '8px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        backgroundColor: loading ? '#f5f5f5' : 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2F5232'}
                      onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    style={{
                      width: '100%',
                      padding: '15px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: loading ? '#BDBDBD' : '#2F5232',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    {loading ? 'Buscando...' : 'Buscar Usuario'}
                  </button>
                </form>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#FEE',
                  border: '1px solid #FCC',
                  borderRadius: '8px',
                  color: '#C33',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              {/* User Found */}
              {usuario && (
                <div style={{
                  width: '100%',
                  padding: '20px',
                  backgroundColor: '#F0F8F0',
                  border: '2px solid #2F5232',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#2F5232', marginBottom: '15px' }}>
                    ✅ Usuario Encontrado
                  </h3>
                  
                  <div className="usuario-editar-info-card" style={{ marginBottom: '20px' }}>
                    <div className="usuario-editar-info-row">
                      <span className="usuario-editar-info-label">Nombre:</span>
                      <span className="usuario-editar-info-value">{usuario.nombre}</span>
                    </div>
                    <div className="usuario-editar-info-row">
                      <span className="usuario-editar-info-label">Apellidos:</span>
                      <span className="usuario-editar-info-value">{usuario.apellido}</span>
                    </div>
                    <div className="usuario-editar-info-row">
                      <span className="usuario-editar-info-label">Correo:</span>
                      <span className="usuario-editar-info-value">{usuario.email}</span>
                    </div>
                    <div className="usuario-editar-info-row">
                      <span className="usuario-editar-info-label">Teléfono:</span>
                      <span className="usuario-editar-info-value">{usuario.telefono || 'No especificado'}</span>
                    </div>
                    <div className="usuario-editar-info-row">
                      <span className="usuario-editar-info-label">Género:</span>
                      <span className="usuario-editar-info-value">{usuario.genero || 'No especificado'}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProcederRegistro}
                    style={{
                      width: '100%',
                      padding: '15px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: '#2F5232',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1F3622'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2F5232'}
                  >
                    Proceder con Registro Biométrico
                  </button>
                </div>
              )}

              {/* Back Button */}
              <button
                onClick={handleVolver}
                style={{
                  padding: '12px 30px',
                  fontSize: '14px',
                  color: '#666',
                  backgroundColor: 'transparent',
                  border: '2px solid #E0E0E0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.borderColor = '#2F5232';
                  e.target.style.color = '#2F5232';
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = '#E0E0E0';
                  e.target.style.color = '#666';
                }}
              >
                ← Volver a Usuarios
              </button>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuscarUsuarioEmail;