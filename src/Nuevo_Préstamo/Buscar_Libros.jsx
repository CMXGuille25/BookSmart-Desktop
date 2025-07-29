import React, { useState, useRef, useEffect } from 'react';
import PantallaTransicion from '../Componentes/PantallaTransicion/PantallaTransicion';
import logo1 from '../assets/logo1.png';
import { useNavigate } from 'react-router-dom';
import './Buscar_Libros.css';
import Sidebar from '../Componentes/Sidebar/Sidebar';

const librosEjemplo = [
  { id: 1, nombre: "Cien años de soledad" },
  { id: 2, nombre: "El principito" },
  { id: 3, nombre: "Don Quijote de la Mancha" },
  { id: 4, nombre: "Rayuela" },
  { id: 5, nombre: "La sombra del viento" },
];

const Buscar_Libros = () => {
  const [busqueda, setBusqueda] = useState("");
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [alerta, setAlerta] = useState({ tipo: '', mensaje: '' }); // tipo: 'buscando' | 'error' | ''
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const searchBoxRef = useRef(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setBusqueda(e.target.value);
    setLibroSeleccionado(null); // Limpiar selección si el usuario escribe
    setAlerta({ tipo: '', mensaje: '' }); // Limpiar alerta al escribir
    setMostrarSugerencias(true);
  };

  // Filtrar libros por nombre
  const librosFiltrados = librosEjemplo.filter(libro =>
    libro.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSugerenciaClick = (libro) => {
    setBusqueda(libro.nombre);
    setLibroSeleccionado(libro);
    setMostrarSugerencias(false);
  };

  // Ocultar sugerencias al hacer clic fuera
  useEffect(() => {
    if (!mostrarSugerencias) return;
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setMostrarSugerencias(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarSugerencias]);

  // Acción al hacer clic en el ícono izquierdo
  const handleBuscarClick = () => {
    if (!busqueda.trim()) {
      setAlerta({ tipo: 'error', mensaje: 'Por favor escribe el nombre del libro.' });
      return;
    }
    // Buscar libro seleccionado o por texto exacto
    let libro = libroSeleccionado;
    if (!libro) {
      libro = librosEjemplo.find(l => l.nombre.toLowerCase() === busqueda.trim().toLowerCase());
    }
    if (libro) {
      setAlerta({ tipo: 'buscando', mensaje: `Buscando libro "${libro.nombre}"...` });
      setTimeout(() => {
        setAlerta({ tipo: '', mensaje: '' });
        // Aquí podrías navegar a la pantalla de detalle en el futuro
      }, 1000);
    } else {
      setAlerta({ tipo: 'error', mensaje: 'Por favor selecciona un libro válido de la lista.' });
    }
  };

  return (
    <div className="buscar-libros-bg">
      <Sidebar />
      <div className="buscar-libros-content">
        <h1 className="nuevo-prestamo-title">Nuevo préstamo</h1>
        <div className="buscar-divider">
          <svg xmlns="http://www.w3.org/2000/svg" width="859.012" height="4" viewBox="0 0 860 4" fill="none">
            <path d="M0 2L859.012 2" stroke="#3A332A" strokeWidth="3" />
          </svg>
        </div>
        <h2 className="buscar-por-title">Buscar por</h2>
        <div className="buscar-por-buttons">
          <button className="buscar-nombre-btn active">Nombre</button>
          <button className="buscar-isbn-btn">ISBN</button>
        </div>
        <div className="libro-card">
          <div className="libro-card-title">Libro que se prestará</div>
          <div className="search-view-modal" style={{position: 'relative'}} ref={searchBoxRef}>
            {/* Icono izquierdo dentro del recuadro blanco */}
            <div
              className="search-content-icon-box"
              style={{ cursor: 'pointer' }}
              onClick={handleBuscarClick}
              tabIndex={0}
              aria-label="Buscar libro"
              role="button"
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleBuscarClick(); }}
            >
              <div className="search-content-icon-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z" fill="#49454F"/>
                </svg>
              </div>
            </div>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar libro..."
                  value={busqueda}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                {/* Resultados filtrados o mensaje amigable */}
                {busqueda && !libroSeleccionado && mostrarSugerencias ? (
                  <div className="sugerencias-dropdown">
                    {librosFiltrados.length > 0 ? (
                      librosFiltrados.map(libro => (
                        <div
                          key={libro.id}
                          className="sugerencia-item"
                          onClick={() => handleSugerenciaClick(libro)}
                        >
                          {libro.nombre}
                        </div>
                      ))
                    ) : (
                      <div className="sugerencia-no-resultados">
                        No se encontraron resultados
                      </div>
                    )}
                  </div>
                ) : null}
                {((!busqueda.trim() && !alerta.tipo) || (busqueda && !libroSeleccionado && !mostrarSugerencias && !alerta.tipo)) && (
                  <div className="sugerencia-mensaje-vacio">
                    Empieza a escribir para ver sugerencias
                  </div>
                )}
              </div>
              {/* Alerta visual centrada debajo del recuadro blanco */}
            {/* ...existing code... */}
            {/* Icono derecho dentro del recuadro blanco */}
            <div
              className="search-content-icon-box right"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setBusqueda("");
                setLibroSeleccionado(null);
                setAlerta({ tipo: '', mensaje: '' });
              }}
              tabIndex={0}
              aria-label="Borrar búsqueda"
              role="button"
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') {
                setBusqueda("");
                setLibroSeleccionado(null);
                setAlerta({ tipo: '', mensaje: '' });
              }}}
            >
              <div className="search-content-icon-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#49454F"/>
                </svg>
              </div>
            </div>
            <div className="search-divider-flex">
              <hr className="search-divider" />
            </div>
          </div>
          {alerta.tipo && (
            <div className={`alerta-visual ${alerta.tipo === 'error' ? 'alerta-error' : 'alerta-buscando'}`}>{alerta.mensaje}</div>
          )}
          <button
            className="siguiente-btn"
            onClick={() => {
              if (libroSeleccionado) {
                setMostrarModal(true);
                setTimeout(() => {
                  setMostrarModal(false);
                  navigate('/detalle-prestamo');
                }, 1000);
              } else {
                setAlerta({ tipo: 'error', mensaje: 'Selecciona un libro antes de continuar.' });
              }
            }}
          >
            Siguiente
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
    </div>
  );
};

export default Buscar_Libros;
