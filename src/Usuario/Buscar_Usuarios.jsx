import { useState } from 'react';
// import BuscarCorreo from '../Componentes/Cuadro_Dialogo/Buscar_Correo.jsx';
import { useNavigate } from 'react-router-dom';
import BuscarCorreo from '../Componentes/Cuadro_Dialogo/Buscar_Correo.jsx';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';
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


const Inicio = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('nombre');
  const [searchValue, setSearchValue] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Simulación de usuarios
  const usuarios = [
    { id: 1, nombre: 'Juan Pérez', correo: 'juan@correo.com', genero: 'Masculino', celular: '1234567890' },
    { id: 2, nombre: 'Ana López', correo: 'ana@correo.com', genero: 'Femenino', celular: '0987654321' },
    // ...más usuarios
  ];

  // Filtrado
  const usuariosFiltrados = usuarios.filter(u => {
    if (searchType === 'nombre') {
      return u.nombre.toLowerCase().includes(searchValue.toLowerCase());
    } else {
      return u.correo.toLowerCase().includes(searchValue.toLowerCase());
    }
  });

  // Handler para el botón Editar
  const handleEditarClick = (usuario) => {
    navigate('/Editar_Usuario'); // Aquí podrías pasar datos del usuario
  };

  // Handler para el botón Nuevo usuario
  const handleNuevoUsuarioClick = () => {
    navigate('/Buscar_Usuario_Email'); // Changed to go to email search first
  };

  // Handler para buscar por correo y mostrar modal si no se encuentra
  const handleBuscar = (e) => {
    e.preventDefault();
    if (searchType === 'correo' && usuariosFiltrados.length === 0 && searchValue.trim() !== '') {
      setShowModal(true);
    }
  };

  // Handler para el modal BuscarCorreo
  const handleBuscarCorreoSubmit = (e) => {
    e.preventDefault();
    const correo = e.target.elements[0].value;
    // Simulación: si el correo no está vacío, se considera válido
    if (correo.trim() !== '') {
      setShowModal(false);
      navigate('/Editar_Usuario');
    }
  };

  return (
    <div className="usuario-bg">
      <Sidebar />
      <main className="usuario-main-content">
        <h1 className="usuario-prestamos-title">Usuarios</h1>
        <div className="usuario-prestamos-desc-row">
          <div className="usuario-prestamos-desc">Administra los datos de los usuarios registrados.</div>
          <button className="usuario-nuevo-prestamo" onClick={handleNuevoUsuarioClick}>
            Nuevo usuario
            <svg className="usuario-nuevo-prestamo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 12" fill="none">
              <path d="M3.66675 6H5.50008M7.33341 6H5.50008M5.50008 6V4M5.50008 6V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.50008 11C8.03139 11 10.0834 8.76142 10.0834 6C10.0834 3.23858 8.03139 1 5.50008 1C2.96878 1 0.916748 3.23858 0.916748 6C0.916748 8.76142 2.96878 11 5.50008 11Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <hr className="usuario-prestamos-divider" />
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
          {usuariosFiltrados.map((u) => (
            <div className="usuario-prestamo-card" key={u.id}>
              <div className="usuario-card-icon">{cardIcon}</div>
              <div className="usuario-card-info">
                <div className="usuario-libro-titulo">{u.nombre}</div>
                <div className="usuario-libro-autor">{u.genero}</div>
                <div className="usuario-libro-entrega">{u.correo}</div>
                <div className="usuario-libro-responsable">{u.celular}</div>
              </div>
              <button className="usuario-editar-btn" onClick={() => handleEditarClick(u)}>
                <span className="usuario-editar-btn-text">Editar</span>
                <svg className="usuario-editar-btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 22" fill="none">
                  <path d="M2.83325 19.25L11.3333 19.25H19.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.5429 5.34269L14.2142 2.74996L18.8889 7.28723L16.2176 9.87996M11.5429 5.34269L6.26835 10.4621C6.07803 10.6468 5.97112 10.8973 5.97112 11.1585L5.97112 15.2878L10.2255 15.2878C10.4947 15.2878 10.7528 15.1841 10.9431 14.9993L16.2176 9.87996M11.5429 5.34269L16.2176 9.87996" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </section>
        {showModal && <BuscarCorreo onSubmit={handleBuscarCorreoSubmit} />}
      </main>
    </div>
  );
};

export default Inicio;
