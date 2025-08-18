import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';
import { fetchWithAuth, validateTokenBeforeRequest } from '../utils/auth.js';
import './Inicio.css';

const menuIcons = {
  inicio: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3L21 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="6" y="12" width="12" height="8" rx="2" fill="#fff"/></svg>
  ),
  usuarios: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="2"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2" stroke="#fff" strokeWidth="2"/></svg>
  ),
  cambiar: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  cerrar: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
};

const cardIcon = (
  <div className="card-icon-img" />
);

const Inicio = () => {
  const navigate = useNavigate();
  
  // ✅ NEW: API-related states
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  
  // Get biblioteca_id from localStorage
  const bibliotecaId = localStorage.getItem('biblioteca');

  // ✅ NEW: Function to fetch prestamos from API
  const fetchPrestamos = async (estadoFiltro = '') => {
    try {
      setLoading(true);
      setError('');

      // Validate token before making request
      if (!validateTokenBeforeRequest()) {
        return;
      }

      if (!bibliotecaId) {
        throw new Error('ID de biblioteca no encontrado. Por favor inicia sesión nuevamente.');
      }

      // Build query parameters
      const queryParams = new URLSearchParams({
        biblioteca_id: bibliotecaId
      });

      if (estadoFiltro && estadoFiltro !== '') {
        queryParams.append('estado', estadoFiltro);
      }

      // Make API call
      const response = await fetchWithAuth(`/api/business/prestamos?${queryParams}`, {
        method: 'GET'
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Préstamos obtenidos exitosamente:', data);
        setPrestamos(data.data || []);
      } else {
        throw new Error(data.msg || 'Error al obtener préstamos');
      }

    } catch (error) {
      console.error('❌ Error fetching prestamos:', error);
      setError(error.message || 'Error al cargar préstamos');
      setPrestamos([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Load prestamos on component mount
  useEffect(() => {
    if (bibliotecaId) {
      fetchPrestamos();
    } else {
      setError('ID de biblioteca no encontrado');
      setLoading(false);
    }
  }, [bibliotecaId]);

  // ✅ NEW: Handle filter change
  const handleFiltroChange = async (nuevoEstado) => {
    setFiltroEstado(nuevoEstado);
    await fetchPrestamos(nuevoEstado);
  };

  // ✅ NEW: Get estado badge color
  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case 'Activo':
        return '#10B981'; // Green
      case 'Entregado':
        return '#6B7280'; // Gray
      case 'Atrasado':
        return '#F59E0B'; // Yellow/Orange
      case 'Perdido':
        return '#EF4444'; // Red
      default:
        return '#6B7280';
    }
  };

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

  // ✅ NEW: Loading component
  if (loading) {
    return (
      <div className="inicio-bg">
        <Sidebar />
        <main className="main-content">
          <h1 className="prestamos-title">Préstamos</h1>
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
              🔄 Cargando préstamos...
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ✅ NEW: Error component
  if (error) {
    return (
      <div className="inicio-bg">
        <Sidebar />
        <main className="main-content">
          <h1 className="prestamos-title">Préstamos</h1>
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
              ⚠️ Error al cargar préstamos
            </div>
            <div style={{ 
              color: '#6b7280', 
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
            <button 
              onClick={() => fetchPrestamos(filtroEstado)}
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
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="inicio-bg">
      <Sidebar />
      <main className="main-content">
        <h1 className="prestamos-title">Préstamos</h1>
        <div className="prestamos-desc-row">
          <div className="prestamos-desc">
            Administra los préstamos de la biblioteca en este espacio.
            {prestamos.length > 0 && (
              <span style={{ marginLeft: '10px', color: '#6B7280', fontSize: '14px' }}>
                ({prestamos.length} préstamo{prestamos.length !== 1 ? 's' : ''})
              </span>
            )}
          </div>
          <button className="nuevo-prestamo" onClick={() => navigate('/Buscar_Libros')}>
            Nuevo préstamo
            <svg className="nuevo-prestamo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 12" fill="none">
              <path d="M3.66675 6H5.50008M7.33341 6H5.50008M5.50008 6V4M5.50008 6V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.50008 11C8.03139 11 10.0834 8.76142 10.0834 6C10.0834 3.23858 8.03139 1 5.50008 1C2.96878 1 0.916748 3.23858 0.916748 6C0.916748 8.76142 2.96878 11 5.50008 11Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <hr className="prestamos-divider" />
        <div className="prestamos-header">
          {/* ✅ UPDATED: Dropdown de Filtrar Por Estado with API integration */}
          <FiltrarEstadoDropdown 
            filtroActual={filtroEstado}
            onFiltroChange={handleFiltroChange}
          />
        </div>

        <section className="prestamos-list">
          {prestamos.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280',
              fontSize: '16px'
            }}>
              {filtroEstado 
                ? `No se encontraron préstamos con estado "${filtroEstado}"`
                : 'No hay préstamos registrados en esta biblioteca'
              }
            </div>
          ) : (
            prestamos.map((prestamo) => (
              <div className="prestamo-card" key={prestamo.id}>
                <div className="card-icon">{cardIcon}</div>
                <div className="card-info">
                  <div className="inicio-titulo-libro" >{prestamo.libro_nombre}</div>
                  <div className="libro-autor">Autor: {prestamo.libro_autor}</div>
                  <div className="libro-row">
                    <div className="libro-entrega">Fecha estimada de entrega:</div>
                    <div className="libro-fecha">{formatDate(prestamo.fecha_devolucion)}</div>
                  </div>
                  <div className="libro-row">
                    <div className="libro-responsable">Responsable del préstamo:</div>
                    <div className="libro-usuario">{prestamo.usuario_nombre}</div>
                  </div>
                  
                  {/* ✅ FIXED: Estado badge - better positioned within card */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: 'auto', // ✅ CHANGED: Push to bottom of flex container
                    paddingTop: '8px', // ✅ ADDED: Some separation from content above
                    paddingRight: '10px'
                  }}>
                    <span style={{
                      backgroundColor: getEstadoBadgeColor(prestamo.estado),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                      display: 'inline-block'
                    }}>
                      {prestamo.estado}
                    </span>
                    
                    {/* ✅ IMPROVED: Show if loan is overdue */}
                    {prestamo.estado === 'Atrasado' && (
                      <span style={{
                        color: '#EF4444',
                        fontSize: '11px',
                        fontWeight: '500',
                        whiteSpace: 'nowrap'
                      }}>
                        ⚠️ Vencido
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  className="editar-btn" 
                  onClick={() => {
                    // Store prestamo data for editing
                    localStorage.setItem('prestamo_editar_temp', JSON.stringify(prestamo));
                    navigate('/Detalle_Prestamo');
                  }}
                >
                  <span className="editar-btn-text">Editar</span>
                  <svg className="editar-btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 22" fill="none">
                    <path d="M2.83325 19.25L11.3333 19.25H19.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.5429 5.34269L14.2142 2.74996L18.8889 7.28723L16.2176 9.87996M11.5429 5.34269L6.26835 10.4621C6.07803 10.6468 5.97112 10.8973 5.97112 11.1585L5.97112 15.2878L10.2255 15.2878C10.4947 15.2878 10.7528 15.1841 10.9431 14.9993L16.2176 9.87996M11.5429 5.34269L16.2176 9.87996" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default Inicio;

// ✅ UPDATED: Dropdown para Filtrar Por Estado with API integration
function FiltrarEstadoDropdown({ filtroActual, onFiltroChange }) {
  const [open, setOpen] = React.useState(false);
  
  const estadosDisponibles = [
    { value: '', label: 'Todos los estados' },
    { value: 'Activo', label: 'Activo' },
    { value: 'Entregado', label: 'Entregado' },
    { value: 'Atrasado', label: 'Atrasado' },
    { value: 'Perdido', label: 'Perdido' }
  ];

  const handleEstadoClick = (estado) => {
    onFiltroChange(estado);
    setOpen(false);
  };

  const estadoActualLabel = estadosDisponibles.find(e => e.value === filtroActual)?.label || 'Filtrar Por Estado';

  return (
    <div className="dropdown-filtrar-estado">
      <div
        className="filtrar-estado"
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="filtrar-estado-svg-izq" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="none">
          <path d="M10 20L10 10" stroke="#453726" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 20L15 13.75" stroke="#453726" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 20L20 16.25" stroke="#453726" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.75 25.65V4.35C3.75 4.01863 4.01863 3.75 4.35 3.75H25.65C25.9814 3.75 26.25 4.01863 26.25 4.35V25.65C26.25 25.9814 25.9814 26.25 25.65 26.25H4.35C4.01863 26.25 3.75 25.9814 3.75 25.65Z" stroke="#453726" strokeWidth="1.5"/>
        </svg>
        <span className="filtrar-estado-label">{estadoActualLabel}</span>
        <svg className="filtrar-estado-svg-der" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">
          <path d="M20 25L11.6666 16.6667H28.3333L20 25Z" fill="#453726"/>
        </svg>
      </div>
      {open && (
        <div className="dropdown-filtrar-estado-menu">
          {estadosDisponibles.map((estado) => (
            <div
              key={estado.value}
              className="dropdown-item"
              onClick={() => handleEstadoClick(estado.value)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: filtroActual === estado.value ? '#f3f4f6' : 'transparent',
                fontWeight: filtroActual === estado.value ? '500' : 'normal'
              }}
            >
              {estado.label}
              {filtroActual === estado.value && (
                <span style={{ marginLeft: '8px', color: '#10B981' }}>✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
