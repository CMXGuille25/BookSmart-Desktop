import React from 'react';
import './Usuario.css';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';

const EditarUsuario = () => {
  return (
    <div className="usuario-editar-bg">
      <Sidebar />
      <main className="main-content">
        <h1 className="prestamos-title">Detalles del préstamo</h1>
        <hr className="prestamos-divider" />
        <div className="usuario-editar-content-row">
          <div className="usuario-editar-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', height: '177px' }}>
              <div className="usuario-editar-libro-imagen"></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '16px' }}>
                <div className="usuario-editar-titulo-libro">Título del libro</div>
                <div className="usuario-editar-autor-libro">Autor</div>
                <div className="usuario-editar-estado-prestamo">Estado del préstamo:</div>
                <button className="usuario-editar-desplegable-prestamo">
                  <select className="usuario-editar-desplegable-texto">
                    <option value="Activo">Activo</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Atrasado">Atrasado</option>
                    <option value="Perdido">Perdido</option>
                  </select>
                  <span className="usuario-editar-desplegable-svg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                      <path d="M17.5 21.875L10.2084 14.5834H24.7917L17.5 21.875Z" fill="#453726"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '10px' }}>
              <div className="usuario-editar-fecha-prestamo">Fecha de préstamo:</div>
              <div style={{ width: '20px' }}></div>
              <div className="usuario-editar-fecha-valor">09/06/2025</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '-25px' }}>
              <div className="usuario-editar-fecha-prestamo">Fecha de entrega:</div>
              <div style={{ width: '20px' }}></div>
              <div className="usuario-editar-fecha-valor">10/06/2025</div>
            </div>
            <div style={{ marginTop: '27px' }}>
              <div className="usuario-editar-info-dias-entrega">El usuario cuenta con n días antes del día de entrega:</div>
            </div>
            <div style={{ marginTop: '27px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div className="usuario-editar-barra-progreso"></div>
                <div style={{ width: '7px' }}></div>
                <div className="usuario-editar-barra-progreso-secundaria"></div>
              </div>
            <button className="usuario-editar-guardar-cambios-btn">Guardar cambios</button>
            </div>
          </div>
          <div className="usuario-editar-card-secundario">
            <div className="usuario-editar-card-secundario-izq">
              <div style={{fontFamily: 'Rowdies', fontSize: '28px', color: '#453726', marginBottom: '8px'}}>Tomar Foto</div>
              <div style={{width: '120px', height: '120px', background: '#A47149', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'}}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none"><rect x="10" y="10" width="40" height="40" rx="8" stroke="#fff" strokeWidth="3"/><circle cx="30" cy="30" r="12" stroke="#fff" strokeWidth="3"/><circle cx="30" cy="30" r="6" fill="#fff"/></svg>
              </div>
              <button style={{background: '#2F5233', color: '#fff', borderRadius: '8px', border: 'none', fontFamily: 'League Spartan', fontSize: '18px', fontWeight: '500', width: '120px', height: '38px', cursor: 'pointer'}}>Registrar</button>
            </div>
            <div className="usuario-editar-card-secundario-der">
              <div style={{fontFamily: 'Rowdies', fontSize: '28px', color: '#453726', marginBottom: '8px'}}>Huella</div>
              <div style={{width: '120px', height: '120px', background: '#A47149', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'}}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none"><rect x="10" y="10" width="40" height="40" rx="8" stroke="#fff" strokeWidth="3"/><path d="M30 20c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10z" stroke="#fff" strokeWidth="3"/><path d="M30 30v10" stroke="#fff" strokeWidth="3"/></svg>
              </div>
              <button style={{background: '#2F5233', color: '#fff', borderRadius: '8px', border: 'none', fontFamily: 'League Spartan', fontSize: '18px', fontWeight: '500', width: '120px', height: '38px', cursor: 'pointer'}}>Registrar</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditarUsuario;
