import React from 'react';
import './Detalle_Prestamo.css';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';

const DetallePrestamo = () => {
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
                <div className="titulo-libro">Título del libro</div>
                <div className="autor-libro">Autor</div>
                <div className="estado-prestamo">Estado del préstamo:</div>
                <button className="desplegable-prestamo">
                  <select className="desplegable-texto">
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
              <div className="fecha-valor">09/06/2025</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '-25px' }}>
              <div className="fecha-prestamo">Fecha de entrega:</div>
              <div style={{ width: '20px' }}></div>
              <div className="fecha-valor">10/06/2025</div>
            </div>
            <div style={{ marginTop: '27px' }}>
              <div className="info-dias-entrega">El usuario cuenta con n días antes del día de entrega:</div>
            </div>
            <div style={{ marginTop: '27px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div className="barra-progreso"></div>
                <div style={{ width: '7px' }}></div>
                <div className="barra-progreso-secundaria"></div>
              </div>
            <button className="guardar-cambios-btn">Guardar cambios</button>
            </div>
          </div>
          <div className="detalle-card-secundario">
            <div className="responsable-prestamo">Responsable del préstamo:</div>
            <div className="libro-imagen-secundaria"></div>
            <div className="nombre-label">Nombre</div>
            <div className="correo-label">Correo electrónico</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetallePrestamo;
