import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuscarCorreo from '../Componentes/Cuadro_Dialogo/Buscar_Correo.jsx';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';
import { fetchWithAuth, validateTokenBeforeRequest } from '../utils/auth.js';
import './Usuario.css';

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
  <div className="usuario-card-icon-img" />
);

const BuscarUsuarios = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('nombre');
  const [searchValue, setSearchValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // ✅ NEW: API-related states
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  });
  const [bibliotecaInfo, setBibliotecaInfo] = useState(null);

  // Get biblioteca_id from localStorage
  const bibliotecaId = localStorage.getItem('biblioteca');

  // ✅ CORRECTED: Function to fetch users from API with the correct URL structure
  const fetchUsuarios = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError('');

      // Validate token before making request
      if (!validateTokenBeforeRequest()) {
        return;
      }

      // ✅ ENHANCED: Better validation and debugging for biblioteca_id
      const bibliotecaIdRaw = localStorage.getItem('biblioteca');
      console.log('🔍 Raw biblioteca_id from localStorage:', bibliotecaIdRaw);
      
      if (!bibliotecaIdRaw) {
        throw new Error('ID de biblioteca no encontrado. Por favor inicia sesión nuevamente.');
      }

      // Parse and validate biblioteca_id
      const bibliotecaIdParsed = parseInt(bibliotecaIdRaw);
      console.log('🔍 Parsed biblioteca_id:', bibliotecaIdParsed);
      
      if (isNaN(bibliotecaIdParsed)) {
        throw new Error(`ID de biblioteca inválido: "${bibliotecaIdRaw}". Debe ser un número.`);
      }

      // ✅ CORRECTED: Build query parameters (without biblioteca_id, since it goes in the URL path)
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (search && search.trim() !== '') {
        queryParams.append('search', search.trim());
      }

      // ✅ CORRECTED: Use biblioteca_id as URL parameter, not query parameter
      const finalUrl = `/api/business/usuario-biblioteca/${bibliotecaIdParsed}?${queryParams.toString()}`;
      console.log('🌐 Final URL being called:', finalUrl);
      console.log('📦 Query parameters:', Object.fromEntries(queryParams));

      // Make API call
      const response = await fetchWithAuth(finalUrl, {
        method: 'GET'
      });

      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📄 Response data:', data);

      if (response.ok) {
        console.log('✅ Usuarios obtenidos exitosamente:', data);
        
        // Update state with API data
        setUsuarios(data.data.usuarios || []);
        setPagination(data.data.pagination || {});
        setBibliotecaInfo(data.data.biblioteca || null);
        
      } else {
        // ✅ ENHANCED: Better error logging
        console.error('❌ API Error Response:', {
          status: response.status,
          code: data.code,
          message: data.msg,
          data: data.data
        });
        
        throw new Error(data.msg || 'Error al obtener usuarios');
      }

    } catch (error) {
      console.error('❌ Error fetching usuarios:', error);
      setError(error.message || 'Error al cargar usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Debug function to check localStorage content
  const debugLocalStorage = () => {
    console.log('🔍 Debugging localStorage:');
    console.log('- biblioteca:', localStorage.getItem('biblioteca'));
    console.log('- user_id:', localStorage.getItem('user_id'));
    console.log('- usuario_id:', localStorage.getItem('usuario_id'));
    console.log('- token:', localStorage.getItem('authToken') ? 'Present' : 'Missing');
    console.log('- All localStorage keys:', Object.keys(localStorage));
  };

  // ✅ MODIFIED: Enhanced useEffect with debugging
  useEffect(() => {
    // Debug localStorage content
    debugLocalStorage();
    
    if (bibliotecaId) {
      console.log('🚀 Starting fetchUsuarios with biblioteca_id:', bibliotecaId);
      fetchUsuarios();
    } else {
      console.error('❌ No biblioteca_id found in localStorage');
      setError('ID de biblioteca no encontrado');
      setLoading(false);
    }
  }, [bibliotecaId]);

  // ✅ MODIFIED: Filter users locally (API also supports server-side search)
  const usuariosFiltrados = usuarios.filter(u => {
    if (!searchValue.trim()) return true;
    
    if (searchType === 'nombre') {
      const nombreCompleto = `${u.nombre} ${u.apellido}`.toLowerCase();
      return nombreCompleto.includes(searchValue.toLowerCase());
    } else {
      return u.correo.toLowerCase().includes(searchValue.toLowerCase());
    }
  });

  // ✅ ADDED: Missing function for "Nuevo usuario" button
  const handleNuevoUsuarioClick = () => {
    navigate('/Registrar_Usuario');
  };

  // ✅ MODIFIED: Handler para el botón Borrar (reemplaza handleEditarClick)
  const handleBorrarClick = async (usuario) => {
    // Confirm deletion
    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar al usuario "${usuario.nombre} ${usuario.apellido}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmacion) {
      return;
    }

    try {
      setLoading(true);
      console.log('🗑️ Eliminando usuario:', usuario.id);

      const response = await fetchWithAuth('/api/business/usuarios-biblioteca/remove-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: parseInt(usuario.id), // ✅ CORRECTED: Use user_id instead of just id
          biblioteca_id: parseInt(bibliotecaId) // ✅ CORRECTED: Include biblioteca_id
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Usuario eliminado exitosamente:', data);
        
        // Show success message
        alert(`Usuario "${usuario.nombre} ${usuario.apellido}" eliminado exitosamente.`);
        
        // Refresh the user list
        await fetchUsuarios(pagination.current_page, searchValue);
        
      } else {
        throw new Error(data.msg || 'Error al eliminar usuario');
      }

    } catch (error) {
      console.error('❌ Error eliminando usuario:', error);
      alert(`Error al eliminar usuario: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ REMOVED: handleEditarClick function (no longer needed)

  // ✅ MODIFIED: Handle search with API integration
  const handleBuscar = async (e) => {
    e.preventDefault();
    
    // For server-side search, call API with search term
    await fetchUsuarios(1, searchValue);
    
    // Show modal if no results found and searching by email
    if (searchType === 'correo' && usuariosFiltrados.length === 0 && searchValue.trim() !== '') {
      setShowModal(true);
    }
  };

  // Handler para el modal BuscarCorreo
  const handleBuscarCorreoSubmit = (e) => {
    e.preventDefault();
    const correo = e.target.elements[0].value;
    if (correo.trim() !== '') {
      setShowModal(false);
      navigate('/Buscar_Usuario_Email');
    }
  };

  // ✅ NEW: Loading component
  if (loading) {
    return (
      <div className="usuario-bg">
        <Sidebar />
        <main className="usuario-main-content">
          <h1 className="usuario-prestamos-title">Usuarios</h1>
          <hr className="usuario-prestamos-divider" />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ color: '#6b7280', fontSize: '16px' }}>
              🔄 Cargando usuarios...
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ✅ NEW: Error component
  if (error) {
    return (
      <div className="usuario-bg">
        <Sidebar />
        <main className="usuario-main-content">
          <h1 className="usuario-prestamos-title">Usuarios</h1>
          <hr className="usuario-prestamos-divider" />
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
              ⚠️ Error al cargar usuarios
            </div>
            <div style={{ 
              color: '#6b7280', 
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
            <button 
              onClick={() => fetchUsuarios()}
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
    <div className="usuario-bg">
      <Sidebar />
      <main className="usuario-main-content">
        <h1 className="usuario-prestamos-title">Usuarios</h1>
        <div className="usuario-prestamos-desc-row">
          <div className="usuario-prestamos-desc">
            {/* ✅ NEW: Show biblioteca info if available */}
            {bibliotecaInfo 
              ? `Administra los usuarios registrados en ${bibliotecaInfo.nombre}.`
              : 'Administra los datos de los usuarios registrados.'
            }
          </div>
          <button className="usuario-nuevo-prestamo" onClick={handleNuevoUsuarioClick}>
            Nuevo usuario
            <svg className="usuario-nuevo-prestamo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 12" fill="none">
              <path d="M3.66675 6H5.50008M7.33341 6H5.50008M5.50008 6V4M5.50008 6V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.50008 11C8.03139 11 10.0834 8.76142 10.0834 6C10.0834 3.23858 8.03139 1 5.50008 1C2.96878 1 0.916748 3.23858 0.916748 6C0.916748 8.76142 2.96878 11 5.50008 11Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <hr className="usuario-prestamos-divider" />
        
        {/* ✅ NEW: Show summary stats */}
        {pagination.total > 0 && (
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <span>📊 Total: {pagination.total} usuarios</span>
            {bibliotecaInfo && <span>📍 {bibliotecaInfo.nombre}</span>}
          </div>
        )}
        
        <div className="usuario-prestamos-header">
          <form className="usuario-search-bar usuario-search-bar-form" onSubmit={handleBuscar}>
            <div className="usuario-search-bar-input-wrapper">
              <input
                type="text"
                className="usuario-search-input"
                placeholder={searchType === 'nombre' ? 'Buscar usuario...' : 'Buscar por correo...'}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
              <button className="usuario-search-btn usuario-search-btn-absolute" type="submit">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="#453726" strokeWidth="2" />
                  <path d="M21 21L17 17" stroke="#453726" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="usuario-search-filter-wrapper">
              <label htmlFor="usuario-search-select" className="usuario-search-filter-label">Filtrar por:</label>
              <select
                id="usuario-search-select"
                value={searchType}
                onChange={e => setSearchType(e.target.value)}
                className="usuario-search-filter-select"
              >
                <option value="nombre">Nombre</option>
                <option value="correo">Correo</option>
              </select>
            </div>
          </form>
        </div>

        <section className="usuario-prestamos-list">
          {usuariosFiltrados.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280',
              fontSize: '16px'
            }}>
              {searchValue.trim() 
                ? `No se encontraron usuarios que coincidan con "${searchValue}"`
                : 'No hay usuarios registrados en esta biblioteca'
              }
            </div>
          ) : (
            usuariosFiltrados.map((u) => (
              <div className="usuario-prestamo-card" key={u.id}>
                <div className="usuario-card-icon">{cardIcon}</div>
                <div className="usuario-card-info">
                  <div className="usuario-libro-titulo">{u.nombre} {u.apellido}</div>
                  <div className="usuario-libro-autor">{u.genero}</div>
                  <div className="usuario-libro-entrega">{u.correo}</div>
                  <div className="usuario-libro-responsable">{u.celular}</div>
                </div>
                
                {/* ✅ MODIFIED: Changed from Editar to Borrar button */}
                <button 
                  className="usuario-borrar-btn"
                  onClick={() => handleBorrarClick(u)}
                  disabled={loading}
                  style={{
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span className="usuario-borrar-btn-text">Borrar</span>
                  {/* ✅ NEW: Delete/trash icon */}
                  <svg className="usuario-borrar-btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6H21M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.4477 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19ZM10 11V17M14 11V17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </section>
        
        {/* ✅ NEW: Pagination controls (if needed) */}
        {pagination.total_pages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '20px',
            padding: '20px'
          }}>
            <button
              onClick={() => fetchUsuarios(pagination.current_page - 1, searchValue)}
              disabled={!pagination.has_prev_page}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: pagination.has_prev_page ? 'white' : '#f3f4f6',
                color: pagination.has_prev_page ? '#374151' : '#9ca3af',
                cursor: pagination.has_prev_page ? 'pointer' : 'not-allowed'
              }}
            >
              Anterior
            </button>
            
            <span style={{
              padding: '8px 16px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              Página {pagination.current_page} de {pagination.total_pages}
            </span>
            
            <button
              onClick={() => fetchUsuarios(pagination.current_page + 1, searchValue)}
              disabled={!pagination.has_next_page}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: pagination.has_next_page ? 'white' : '#f3f4f6',
                color: pagination.has_next_page ? '#374151' : '#9ca3af',
                cursor: pagination.has_next_page ? 'pointer' : 'not-allowed'
              }}
            >
              Siguiente
            </button>
          </div>
        )}
        
        {showModal && <BuscarCorreo onSubmit={handleBuscarCorreoSubmit} />}
      </main>
    </div>
  );
};

export default BuscarUsuarios;
