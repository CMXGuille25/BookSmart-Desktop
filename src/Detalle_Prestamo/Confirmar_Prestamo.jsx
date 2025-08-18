import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PrestamoCancelado from '../Componentes/Modal_Prestamos/Prestamo_Cancelado.jsx';
import PrestamoExitoso from '../Componentes/Modal_Prestamos/prestamo_Exitoso.jsx';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';
import { fetchWithAuth } from '../utils/auth.js'; // ✅ UPDATED: Use correct auth utility
import { getSelectedBook } from '../utils/prestamo.js';
import './Detalle_Prestamo.css';

const ConfirmarPrestamo = () => {
  const [modal, setModal] = useState(null);
  const [libro, setLibro] = useState(null);
  const [usuarioVerificado, setUsuarioVerificado] = useState(null); // ✅ NEW: User data state
  const [fechaPrestamo, setFechaPrestamo] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [loading, setLoading] = useState(false); // ✅ NEW: Loading state
  const [error, setError] = useState(''); // ✅ NEW: Error state
  const navigate = useNavigate();

  // ✅ NEW: Load verified user data and selected book
  useEffect(() => {
    // 1. Get verified user data
    const usuarioData = localStorage.getItem('usuario_prestamo_verificado');
    if (usuarioData) {
      try {
        const userData = JSON.parse(usuarioData);
        setUsuarioVerificado(userData);
        console.log('👤 Usuario verificado cargado:', userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Error al cargar datos del usuario');
      }
    } else {
      console.warn('⚠️ No se encontraron datos del usuario verificado');
      setError('No se encontraron datos del usuario verificado');
    }

    // 2. Get selected book
    const libroSel = getSelectedBook();
    if (libroSel) {
      setLibro(libroSel);
      console.log('📚 Libro seleccionado cargado:', libroSel);
    } else {
      console.warn('⚠️ No se encontró libro seleccionado');
      setError('No se encontró libro seleccionado');
    }

    // 3. Set dates
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();
    setFechaPrestamo(`${dia}/${mes}/${anio}`);
    
    // Return date: 7 days from today (adjust as needed)
    const fechaEntregaObj = new Date(hoy);
    fechaEntregaObj.setDate(hoy.getDate() + 7); // ✅ UPDATED: 7 days instead of 3
    const diaEnt = String(fechaEntregaObj.getDate()).padStart(2, '0');
    const mesEnt = String(fechaEntregaObj.getMonth() + 1).padStart(2, '0');
    const anioEnt = fechaEntregaObj.getFullYear();
    setFechaEntrega(`${diaEnt}/${mesEnt}/${anioEnt}`);
  }, []);

  // ✅ NEW: Convert date format for API (dd/mm/yyyy -> yyyy-mm-dd)
  const convertDateForAPI = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleCancelar = () => {
    setModal('cancelado');
  };

  // ✅ UPDATED: Complete loan creation with proper API call
  const handleFinalizar = async () => {
    // Validate required data
    if (!usuarioVerificado || !libro) {
      setError('Faltan datos requeridos para crear el préstamo');
      return;
    }

    if (!usuarioVerificado.verificacion_biometrica_completa) {
      setError('La verificación biométrica no está completa');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('🔄 Creando nuevo préstamo...');

      // Prepare API payload (adjust according to your API requirements)
      const prestamoData = {
        user_id: parseInt(usuarioVerificado.user_id),
        libro_biblioteca_id: parseInt(libro.id || libro.libro_biblioteca_id),
        biblioteca_id: parseInt(usuarioVerificado.biblioteca_id),
        fecha_prestamo: convertDateForAPI(fechaPrestamo),
        fecha_devolucion: convertDateForAPI(fechaEntrega),
        estado: 'Activo'
      };

      console.log('📤 Enviando datos del préstamo:', prestamoData);

      // Create the loan via API
      const response = await fetchWithAuth('/api/business/prestamos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(prestamoData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Préstamo creado exitosamente:', data);
        
        // Clean up localStorage
        localStorage.removeItem('usuario_prestamo_temp');
        localStorage.removeItem('usuario_prestamo_verificado');
        localStorage.removeItem('libro_seleccionado'); // Clear selected book
        
        setModal('exitoso');
      } else {
        console.error('❌ Error en la respuesta:', data);
        throw new Error(data.msg || 'Error al crear el préstamo');
      }

    } catch (error) {
      console.error('❌ Error creando préstamo:', error);
      setError(`Error al crear préstamo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModal(null);
    navigate('/Inicio');
  };

  // ✅ NEW: Show error state if critical data is missing
  if (error && (!usuarioVerificado || !libro)) {
    return (
      <div className="detalle-bg">
        <Sidebar />
        <main className="main-content">
          <h1 className="prestamos-title">Nuevo préstamo</h1>
          <hr className="prestamos-divider" />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ 
              color: '#dc2626', 
              fontSize: '18px', 
              fontWeight: '500',
              textAlign: 'center'
            }}>
              ⚠️ Datos incompletos para crear préstamo
            </div>
            <div style={{ 
              color: '#6b7280', 
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => navigate('/Escanear_Tarjeta_Usuario')}
                style={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Reiniciar proceso
              </button>
              <button 
                onClick={() => navigate('/Inicio')}
                style={{
                  backgroundColor: '#6B7280',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="detalle-bg">
      <Sidebar />
      <main className="main-content">
        <h1 className="prestamos-title">Nuevo préstamo</h1>
        <hr className="prestamos-divider" />
        
        {/* ✅ NEW: Show error message if any */}
        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#dc2626',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div className="detalle-content-row">
          <div className="detalle-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', height: '177px' }}>
              <div className="libro-imagen"></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '16px' }}>
                {/* ✅ UPDATED: Use libro data */}
                <div className="titulo-libro">{libro ? libro.nombre : 'Título del libro'}</div>
                <div className="autor-libro">{libro ? libro.autor : 'Autor'}</div>
                <div className="estado-prestamo">Estado del préstamo:</div>
                <button className="desplegable-prestamo">
                  <select className="desplegable-texto" disabled>
                    <option value="Activo">Activo</option>
                  </select>
                  <span className="desplegable-svg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                      <path d="M17.5 21.875L10.2084 14.5834H24.7917L17.5 21.875Z" fill="#453726"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '10px' }}>
              <div className="fecha-prestamo">Fecha de préstamo:</div>
              <div style={{ width: '20px' }}></div>
              <div className="fecha-valor">{fechaPrestamo}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '-25px' }}>
              <div className="fecha-prestamo">Fecha de entrega:</div>
              <div style={{ width: '20px' }}></div>
              <div className="fecha-valor">{fechaEntrega}</div>
            </div>
            <div style={{ marginTop: '27px' }}>
              {/* ✅ UPDATED: Dynamic days message */}
              <div className="info-dias-entrega">
                A partir de hoy, el usuario contará con 7 días para devolver el libro
              </div>
            </div>
            <div style={{ marginTop: '27px', display: 'flex', flexDirection: 'row', gap: '24px', justifyContent: 'center' }}>
              <button 
                className="cancelar-btn" 
                onClick={handleCancelar}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                className="finalizar-btn" 
                onClick={handleFinalizar}
                disabled={loading}
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Creando préstamo...' : 'Finalizar proceso'}
              </button>
            </div>
          </div>
          
          {/* ✅ UPDATED: Show verified user information */}
          <div className="detalle-card-secundario">
            <div className="responsable-prestamo">Responsable del préstamo:</div>
            <div className="libro-imagen-secundaria"></div>
            <div className="nombre-label">
              {usuarioVerificado 
                ? `${usuarioVerificado.usuario_nombre} ${usuarioVerificado.usuario_apellido}`
                : 'Nombre'
              }
            </div>
            <div className="correo-label">
              {usuarioVerificado?.usuario_email || 'Correo electrónico'}
            </div>
            
            {/* ✅ NEW: Show verification details */}
            {usuarioVerificado?.verificacion_biometrica_completa && (
              <div style={{
                marginTop: '15px',
                padding: '10px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #10B981',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: '#065F46', fontWeight: '600' }}>
                  ✅ Verificación biométrica completa
                </div>
                {usuarioVerificado.verification_details?.confidence_score && (
                  <div style={{ fontSize: '10px', color: '#047857', marginTop: '3px' }}>
                    Puntuación: {usuarioVerificado.verification_details.confidence_score}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {modal === 'cancelado' && <PrestamoCancelado onClose={handleCloseModal} />}
        {modal === 'exitoso' && <PrestamoExitoso onClose={handleCloseModal} />}
      </main>
    </div>
  );
};

export default ConfirmarPrestamo; // ✅ UPDATED: Export name
