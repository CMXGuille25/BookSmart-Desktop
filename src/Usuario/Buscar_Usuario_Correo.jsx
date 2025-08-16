import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';
import { fetchWithAuth, validateTokenBeforeRequest } from '../utils/auth.js';
import './Usuario.css';

const BuscarUsuarioEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [biometricStatus, setBiometricStatus] = useState(null); // ✅ NUEVO: Estado biométrico

  // Get biblioteca_id from localStorage
  const bibliotecaId = localStorage.getItem('biblioteca');

  const buscarUsuarioPorEmail = async (emailBusqueda) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetchWithAuth('/api/business/buscar-usuario-email', {
        method: 'POST',
        body: JSON.stringify({
          email: emailBusqueda,
          biblioteca_id: parseInt(bibliotecaId)
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'Usuario encontrado') {
        console.log('✅ Usuario encontrado:', data);
        
        // Extract user data from the correct structure
        const usuarioData = data.data.usuario;
        const biometricData = data.data.biometric_status; // ✅ NUEVO: Extraer datos biométricos
        
        setUsuario(usuarioData);
        setBiometricStatus(biometricData); // ✅ NUEVO: Guardar estado biométrico
        
        return { success: true, data: usuarioData, biometric_status: biometricData };
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
      setBiometricStatus(null); // ✅ NUEVO: Limpiar estado biométrico en error
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();

    // Validate token before proceeding
    if (!validateTokenBeforeRequest()) {
        return; // This will redirect to login if no token
    }

    if (!email.trim()) {
      setError('Por favor ingrese un correo electrónico');
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor ingrese un correo electrónico válido');
      return;
    }

    // Reset previous states
    setError('');
    setUsuario(null);
    setBiometricStatus(null); // ✅ NUEVO: Limpiar estado biométrico
    setLoading(true);

    try {
        const resultado = await buscarUsuarioPorEmail(email);
        // ... rest of your logic
    } catch (error) {
        console.error('❌ Error buscando usuario:', error);
        
        // Handle auth-specific errors more gracefully
        if (error.message.includes('authentication') || error.message.includes('token')) {
            setError('Tu sesión ha expirado. Redirigiendo al inicio de sesión...');
        } else {
            setError(error.message || 'Error al buscar usuario');
        }
    } finally {
        setLoading(false);
    }
  };

  const handleProcederRegistro = () => {
    if (usuario && biometricStatus) {
      // ✅ MODIFICADO: Incluir datos biométricos en localStorage
      localStorage.setItem('usuario_registro_temp', JSON.stringify({
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.correo, // Note: API returns 'correo' not 'email'
        telefono: usuario.celular, // Note: API returns 'celular' not 'telefono'
        genero: usuario.genero || 'No especificado',
        // ✅ NUEVO: Incluir estado biométrico inicial
        biometric_status: {
          foto_registrada: biometricStatus.foto_registrada || false,
          huella_registrada: biometricStatus.huella_registrada || false,
          tarjeta_registrada: biometricStatus.tarjeta_registrada || false,
          datos_adicional_existe: biometricStatus.datos_adicional_existe || false
        }
      }));
      
      // Navigate to biometric registration
      navigate('/Registrar_Usuario');
    }
  };

  const handleVolver = () => {
    navigate('/Usuarios');
  };

  // ✅ NUEVA FUNCIÓN: Calcular progreso biométrico
  const calcularProgresoBiometrico = () => {
    if (!biometricStatus) return { completados: 0, total: 3, porcentaje: 0 };
    
    const completados = [
      biometricStatus.foto_registrada,
      biometricStatus.huella_registrada, 
      biometricStatus.tarjeta_registrada
    ].filter(Boolean).length;
    
    return {
      completados,
      total: 3,
      porcentaje: Math.round((completados / 3) * 100)
    };
  };

  const progreso = calcularProgresoBiometrico();

  return (
    <div className="usuario-editar-bg">
      <Sidebar />
      <main className="main-content">
        <h1 className="prestamos-title">Buscar Usuario</h1>
        <hr className="prestamos-divider" />
        
        <div className="usuario-editar-content-row">
          <div className="usuario-editar-card" style={{ height: 'auto', minHeight: '400px', width: '100%', maxWidth: '600px' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              padding: '40px',
              gap: '20px'
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
                        backgroundColor: loading ? '#f5f5f5' : 'white',
                        color: '#453726'
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
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  color: '#DC2626',
                  textAlign: 'center',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              {/* User Found - Enhanced with Biometric Status */}
              {usuario && biometricStatus && (
                <div style={{
                  width: '100%',
                  marginTop: '10px',
                  animation: 'slideIn 0.3s ease-out'
                }}>
                  {/* User Info Card */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#F8FAF8',
                    border: '2px solid #D1E7DD',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(47, 82, 50, 0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '15px',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '20px' }}>✅</span>
                      <h3 style={{ color: '#2F5232', margin: 0, fontSize: '18px' }}>
                        Usuario Encontrado
                      </h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: '#453726' }}>Nombre:</span>
                        <span style={{ color: '#453726' }}>{usuario.nombre}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: '#453726' }}>Apellidos:</span>
                        <span style={{ color: '#453726' }}>{usuario.apellido}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: '#453726' }}>Correo:</span>
                        <span style={{ color: '#453726', fontSize: '14px' }}>{usuario.correo}</span>
                      </div>
                    </div>

                    {/* ✅ NUEVO: Estado Biométrico */}
                    <div style={{
                      borderTop: '1px solid #D1E7DD',
                      paddingTop: '15px',
                      marginTop: '15px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}>
                        <span style={{ fontWeight: '600', color: '#453726', fontSize: '14px' }}>
                          Datos Biométricos:
                        </span>
                        <span style={{ 
                          color: progreso.completados === 3 ? '#10B981' : '#F59E0B',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {progreso.completados}/3 completados ({progreso.porcentaje}%)
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px'
                        }}>
                          <span style={{ 
                            color: biometricStatus.foto_registrada ? '#10B981' : '#DC2626' 
                          }}>
                            {biometricStatus.foto_registrada ? '✅' : '❌'}
                          </span>
                          <span style={{ color: '#453726' }}>Foto</span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px'
                        }}>
                          <span style={{ 
                            color: biometricStatus.huella_registrada ? '#10B981' : '#DC2626' 
                          }}>
                            {biometricStatus.huella_registrada ? '✅' : '❌'}
                          </span>
                          <span style={{ color: '#453726' }}>Huella</span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px'
                        }}>
                          <span style={{ 
                            color: biometricStatus.tarjeta_registrada ? '#10B981' : '#DC2626' 
                          }}>
                            {biometricStatus.tarjeta_registrada ? '✅' : '❌'}
                          </span>
                          <span style={{ color: '#453726' }}>Tarjeta</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${progreso.porcentaje}%`,
                          height: '100%',
                          backgroundColor: progreso.completados === 3 ? '#10B981' : '#F59E0B',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  </div>

                  {/* Action Button - Text changes based on completion */}
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
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 4px rgba(47, 82, 50, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#1F3622';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(47, 82, 50, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#2F5232';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 4px rgba(47, 82, 50, 0.3)';
                    }}
                  >
                    {/* ✅ MEJORADO: Texto dinámico según el estado */}
                    {progreso.completados === 3 
                      ? 'Finalizar Registro en Biblioteca →' 
                      : `Completar Registro Biométrico (${progreso.completados}/3) →`
                    }
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
                  transition: 'all 0.2s',
                  marginTop: usuario ? '10px' : '20px'
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
      
      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BuscarUsuarioEmail;