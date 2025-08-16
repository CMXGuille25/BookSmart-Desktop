
import React, { useState, useRef, useEffect } from 'react';
import PantallaTransicion from '../Componentes/PantallaTransicion/PantallaTransicion';
import logo1 from '../assets/logo1.png';
import { useNavigate } from 'react-router-dom';
import './Buscar_Libros.css';
import { setSelectedBook, getSelectedBook } from '../utils/prestamo.js';
import Sidebar from '../Componentes/Sidebar/Sidebar';


const Buscar_Libros = () => {
  const [busqueda, setBusqueda] = useState("");
  const [libros, setLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState(() => getSelectedBook());
  const [alerta, setAlerta] = useState({ tipo: '', mensaje: '' });
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const searchBoxRef = useRef(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  // Obtener libros desde la API al montar el componente
  useEffect(() => {
    fetch('http://localhost:60881/libros')
      .then(res => res.json())
      .then(data => {
        setLibros(data.data || []);
      })
      .catch(() => {
        setLibros([]);
        setAlerta({ tipo: 'error', mensaje: 'No se pudieron cargar los libros.' });
      });
  }, []);

  // Estado para filtro activo
  const [filtro, setFiltro] = useState('nombre'); // 'nombre' o 'isbn'
  // Filtrar libros por nombre o ISBN según el filtro activo
  const librosFiltrados = libros.filter(libro => {
    if (filtro === 'nombre') {
      return libro.nombre && libro.nombre.toLowerCase().includes(busqueda.toLowerCase());
    } else {
      return libro.isbn && libro.isbn.toLowerCase().includes(busqueda.toLowerCase());
    }
  });

  // Depuración: ver los libros en consola
  // console.log(libros);

  const handleInputChange = (e) => {
    setBusqueda(e.target.value);
    setLibroSeleccionado(null);
    setAlerta({ tipo: '', mensaje: '' });
    setMostrarSugerencias(true);
  };

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

  const handleBuscarClick = () => {
    if (!busqueda.trim()) {
      setAlerta({ tipo: 'error', mensaje: 'Por favor escribe el nombre del libro.' });
      return;
    }
    let libro = libroSeleccionado;
    if (!libro) {
      libro = libros.find(l => l.nombre && l.nombre.toLowerCase() === busqueda.trim().toLowerCase());
    }
    if (libro) {
      setAlerta({ tipo: 'buscando', mensaje: `Buscando libro "${libro.nombre}"...` });
      setTimeout(() => {
        setAlerta({ tipo: '', mensaje: '' });
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
          <button
            className={`buscar-nombre-btn${filtro === 'nombre' ? ' active' : ''}`}
            onClick={() => {
              setFiltro('nombre');
              setBusqueda('');
              setLibroSeleccionado(null);
              setMostrarSugerencias(false);
              setAlerta({ tipo: '', mensaje: '' });
            }}
          >
            Nombre
          </button>
          <button
            className={`buscar-isbn-btn${filtro === 'isbn' ? ' active' : ''}`}
            onClick={() => {
              setFiltro('isbn');
              setBusqueda('');
              setLibroSeleccionado(null);
              setMostrarSugerencias(false);
              setAlerta({ tipo: '', mensaje: '' });
            }}
          >
            ISBN
          </button>
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
                  placeholder={filtro === 'nombre' ? "Buscar libro por nombre..." : "Buscar libro por ISBN..."}
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
                          key={libro.id || libro.libro_biblioteca_id || libro.nombre}
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
                setSelectedBook(libroSeleccionado);
                setMostrarModal(true);
                setTimeout(() => {
                  setMostrarModal(false);
                  navigate('/Escanear_Tarjeta_Usuario');
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
