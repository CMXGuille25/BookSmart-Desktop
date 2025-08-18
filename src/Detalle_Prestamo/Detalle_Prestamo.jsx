import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PantallaTransicion from '../Componentes/PantallaTransicion/PantallaTransicion';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';
import logo1 from '../assets/logo1.png';
import { fetchWithAuth, validateTokenBeforeRequest } from '../utils/auth.js';
import './Detalle_Prestamo.css';

const DetallePrestamo = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  
  // ✅ UPDATED: Replace libro state with prestamo state for full loan details
  const [prestamo, setPrestamo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Activo');
  const [actualizandoEstado, setActualizandoEstado] = useState(false);
  
  const navigate = useNavigate();

  // ✅ NEW: Get prestamo ID from localStorage (set when clicking "Ver Detalles")
  const prestamoId = localStorage.getItem('prestamo_detalle_id');

  // ✅ NEW: Fetch prestamo details from API
  const fetchPrestamoDetalles = async () => {
    try {
      setLoading(true);
      setError('');

      if (!validateTokenBeforeRequest()) {
        return;
      }

      if (!prestamoId) {
        throw new Error('ID de préstamo no encontrado');
      }

      console.log('🔍 Obteniendo detalles del préstamo:', prestamoId);

      const response = await fetchWithAuth(`/api/business/prestamo/${prestamoId}`, {
        method: 'GET'
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Detalles del préstamo obtenidos:', data);
        setPrestamo(data.data);
        setEstadoSeleccionado(data.data.estado); // Set current status
      } else {
        throw new Error(data.msg || 'Error al obtener detalles del préstamo');
      }

    } catch (error) {
      console.error('❌ Error fetching prestamo details:', error);
      setError(error.message || 'Error al cargar detalles del préstamo');
      setPrestamo(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: Load prestamo details instead of selected book
  useEffect(() => {
    if (prestamoId) {
      fetchPrestamoDetalles();
    } else {
      setError('ID de préstamo no encontrado');
      setLoading(false);
    }
  }, [prestamoId]);

  // ✅ NEW: Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // ✅ NEW: Calculate days until return
  const calcularDiasHastaEntrega = (fechaDevolucion) => {
    if (!fechaDevolucion) return 0;
    const hoy = new Date();
    const fechaVencimiento = new Date(fechaDevolucion);
    const diferencia = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
    return Math.max(0, diferencia);
  };

  // ✅ UPDATED: Save changes with API call
  const handleGuardar = async () => {
    if (!prestamo || estadoSeleccionado === prestamo.estado) {
      // No changes made
      setMostrarModal(true);
      setTimeout(() => {
        setMostrarModal(false);
        navigate('/Inicio');
      }, 1000);
      return;
    }

    try {
      setActualizandoEstado(true);
      console.log(`🔄 Actualizando estado del préstamo ${prestamoId} a: ${estadoSeleccionado}`);

      const response = await fetchWithAuth(`/api/business/prestamo/${prestamoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: estadoSeleccionado,
          ...(estadoSeleccionado === 'Entregado' && { 
            fecha_entrega_real: new Date().toISOString().split('T')[0] 
          })
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Estado actualizado exitosamente:', data);
        setMostrarModal(true);
        setTimeout(() => {
          setMostrarModal(false);
          navigate('/Inicio');
        }, 1000);
      } else {
        throw new Error(data.msg || 'Error al actualizar estado');
      }

    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
      alert(`Error al actualizar estado: ${error.message}`);
    } finally {
      setActualizandoEstado(false);
    }
  };

  // ✅ NEW: Early return for no prestamo ID
  if (!prestamoId) {
    return (
      <div className="detalle-bg">
        <Sidebar />
        <main className="main-content">
          <h1 className="prestamos-title">Detalles del préstamo</h1>
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
              ⚠️ ID de préstamo no encontrado
            </div>
            <button 
              onClick={() => navigate('/Inicio')}
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
              Volver al inicio
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ✅ NEW: Loading state
  if (loading) {
    return (
      <div className="detalle-bg">
        <Sidebar />
        <main className="main-content">
          <h1 className="prestamos-title">Detalles del préstamo</h1>
          <hr className="prestamos-divider" />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ color: '#6b7280', fontSize: '16px' }}>
              🔄 Cargando detalles del préstamo...
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ✅ NEW: Error state
  if (error) {
    return (
      <div className="detalle-bg">
        <Sidebar />
        <main className="main-content">
          <h1 className="prestamos-title">Detalles del préstamo</h1>
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
              ⚠️ Error al cargar detalles
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
                onClick={fetchPrestamoDetalles}
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
                Reintentar
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
                Volver
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ✅ UPDATED: Calculate days for current prestamo
  const diasHastaEntrega = prestamo ? calcularDiasHastaEntrega(prestamo.fecha_devolucion) : 0;

  return (
    <div className="detalle-bg">
      <Sidebar />
      <main className="main-content">
        <h1 className="prestamos-title">Detalles del préstamo</h1>
        <hr className="prestamos-divider" />
        <div className="detalle-content-row">
          <div className="detalle-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', height: '177px' }}>
              <div className="libro-imagen"></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '16px' }}>
                {/* ✅ UPDATED: Use prestamo data instead of libro */}
                <div className="titulo-libro">{prestamo?.libro_nombre || 'Título del libro'}</div>
                <div className="autor-libro">{prestamo?.libro_autor || 'Autor'}</div>
                <div className="estado-prestamo">Estado del préstamo:</div>
                <button className="desplegable-prestamo">
                  {/* ✅ UPDATED: Controlled select with state */}
                  <select 
                    className="desplegable-texto"
                    value={estadoSeleccionado}
                    onChange={(e) => setEstadoSeleccionado(e.target.value)}
                    disabled={actualizandoEstado}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Atrasado">Atrasado</option>
                    <option value="Perdido">Perdido</option>
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
              {/* ✅ UPDATED: Use prestamo date */}
              <div className="fecha-valor">{formatDate(prestamo?.fecha_prestamo)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '-25px' }}>
              <div className="fecha-prestamo">Fecha de entrega:</div>
              <div style={{ width: '20px' }}></div>
              {/* ✅ UPDATED: Use prestamo return date */}
              <div className="fecha-valor">{formatDate(prestamo?.fecha_devolucion)}</div>
            </div>
            <div style={{ marginTop: '27px' }}>
              {/* ✅ UPDATED: Dynamic days calculation */}
              <div className="info-dias-entrega">
                El usuario cuenta con {diasHastaEntrega} días antes del día de entrega
              </div>
            </div>
            <div style={{ marginTop: '27px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div className="barra-progreso"></div>
                <div style={{ width: '7px' }}></div>
                <div className="barra-progreso-secundaria"></div>
              </div>
            {/* ✅ UPDATED: Button with loading state */}
            <button 
              className="guardar-cambios-btn" 
              onClick={handleGuardar}
              disabled={actualizandoEstado}
              style={{
                opacity: actualizandoEstado ? 0.7 : 1,
                cursor: actualizandoEstado ? 'not-allowed' : 'pointer'
              }}
            >
              {actualizandoEstado ? 'Guardando...' : 'Guardar cambios'}
            </button>
            {mostrarModal && (
              <PantallaTransicion
                icono={logo1}
                soloIcono={true}
                onClose={() => setMostrarModal(false)}
              />
            )}
            </div>
          </div>
          <div className="detalle-card-secundario">
            <div className="responsable-prestamo">Responsable del préstamo:</div>
            <div className="libro-imagen-secundaria"></div>
            {/* ✅ UPDATED: Use prestamo user data */}
            <div className="nombre-label">{prestamo?.usuario_nombre || 'Nombre'}</div>
            <div className="correo-label">{prestamo?.usuario_email || 'Correo electrónico'}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetallePrestamo;
