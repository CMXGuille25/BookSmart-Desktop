import React, { useState } from 'react';
import libroVacio from '../assets/Libro_vacio.png';
import './Inicio.css';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';

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
  return (
    <div className="inicio-bg">
      <Sidebar />
      <main className="main-content">
        <h1 className="prestamos-title">Préstamos</h1>
        <div className="prestamos-desc-row">
          <div className="prestamos-desc">Administra los préstamos de la biblioteca en este espacio.</div>
          <button className="nuevo-prestamo">
            Nuevo préstamo
            <svg className="nuevo-prestamo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 12" fill="none">
              <path d="M3.66675 6H5.50008M7.33341 6H5.50008M5.50008 6V4M5.50008 6V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.50008 11C8.03139 11 10.0834 8.76142 10.0834 6C10.0834 3.23858 8.03139 1 5.50008 1C2.96878 1 0.916748 3.23858 0.916748 6C0.916748 8.76142 2.96878 11 5.50008 11Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <hr className="prestamos-divider" />
        <div className="prestamos-header">
          {/* Dropdown de Filtrar Por Estado */}
          <FiltrarEstadoDropdown />
        </div>


        <section className="prestamos-list">
          {[1,2,3,4,5,6,7,8,9,10].map((i) => (
            <div className="prestamo-card" key={i}>
              <div className="card-icon">{cardIcon}</div>
              <div className="card-info">
                <div className="inicio-titulo-libro">Titulo del libro</div>
                <div className="libro-autor">Autor:</div>
                <div className="libro-row">
                  <div className="libro-entrega">Fecha estimada de entrega:</div>
                  <div className="libro-fecha">10/06/2025</div>
                </div>
                <div className="libro-row">
                  <div className="libro-responsable">Responsable del préstamo:</div>
                  <div className="libro-usuario">Usuario No.1</div>
                </div>
              </div>
              <button className="editar-btn">
                <span className="editar-btn-text">Editar</span>
                <svg className="editar-btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 22" fill="none">
                  <path d="M2.83325 19.25L11.3333 19.25H19.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.5429 5.34269L14.2142 2.74996L18.8889 7.28723L16.2176 9.87996M11.5429 5.34269L6.26835 10.4621C6.07803 10.6468 5.97112 10.8973 5.97112 11.1585L5.97112 15.2878L10.2255 15.2878C10.4947 15.2878 10.7528 15.1841 10.9431 14.9993L16.2176 9.87996M11.5429 5.34269L16.2176 9.87996" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Inicio;

// Dropdown para Filtrar Por Estado
function FiltrarEstadoDropdown() {
  const [open, setOpen] = React.useState(false);
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
        <span className="filtrar-estado-label">Filtrar Por Estado</span>
        <svg className="filtrar-estado-svg-der" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">
          <path d="M20 25L11.6666 16.6667H28.3333L20 25Z" fill="#453726"/>
        </svg>
      </div>
      {open && (
        <div className="dropdown-filtrar-estado-menu">
          (Sin opciones)
        </div>
      )}
    </div>
  );
}
