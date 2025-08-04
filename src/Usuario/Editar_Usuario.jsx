import React from 'react';
import './Usuario.css';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';

const EditarUsuario = () => {
  return (
    <div className="usuario-editar-bg">
      <Sidebar />
      <main className="main-content">
        <h1 className="prestamos-title">Usuarios</h1>
        <hr className="prestamos-divider" />
        <div className="usuario-editar-content-row">
          <div className="usuario-editar-card" style={{ height: '580px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <div className="usuario-editar-libro-imagen usuario-editar-libro-imagen-top"></div>
              <div className="usuario-editar-info-card">
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Nombre:</span>
                  <span className="usuario-editar-info-value">Defnom</span>
                </div>
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Apellidos:</span>
                  <span className="usuario-editar-info-value">Defape</span>
                </div>
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Correo:</span>
                  <span className="usuario-editar-info-value">DefCorreo</span>
                </div>
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Número:</span>
                  <span className="usuario-editar-info-value">Defnum</span>
                </div>
                <div className="usuario-editar-info-row">
                  <span className="usuario-editar-info-label">Género:</span>
                  <span className="usuario-editar-info-value">Defgen</span>
                </div>
              </div>
              <button className="usuario-editar-guardar-cambios-btn-custom" style={{ margin: '40px auto 0 auto', border: 'none', color: '#FFF', fontFamily: 'League Spartan', fontSize: '20px', fontWeight: 600, cursor: 'pointer', display: 'block' }}>
                Guardar cambios
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="usuario-editar-cuadro-secundario usuario-editar-cuadro-secundario-primero">
              <div className="usuario-editar-cuadro-titulo">Tomar foto</div>
              <div className="usuario-editar-cuadro-imagen-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" fill="none">
                  <path d="M43.75 112.5V82C43.75 78.134 46.884 75 50.75 75H99.25C103.116 75 106.25 78.134 106.25 82V112.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M75 75C85.3553 75 93.75 66.6053 93.75 56.25C93.75 45.8947 85.3553 37.5 75 37.5C64.6447 37.5 56.25 45.8947 56.25 56.25C56.25 66.6053 64.6447 75 75 75Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M131.25 19.35V130.65C131.25 130.981 130.981 131.25 130.65 131.25H19.35C19.0186 131.25 18.75 130.981 18.75 130.65V19.35C18.75 19.0186 19.0186 18.75 19.35 18.75H130.65C130.981 18.75 131.25 19.0186 131.25 19.35Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <button className="usuario-editar-registrar-btn">Registrar</button>
            </div>
            <div className="usuario-editar-cuadro-secundario usuario-editar-cuadro-secundario-segundo">
              <div className="usuario-editar-cuadro-titulo">Huella</div>
              <div className="usuario-editar-cuadro-imagen-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" fill="none">
                  <path d="M43.75 100V71.0096C43.75 67.8236 44.3766 64.7652 45.5282 61.9231M106.25 100V80.0962M57.6389 48.3404C62.6045 45.4409 68.5759 43.75 75 43.75C89.2469 43.75 101.267 52.0664 105.029 63.4375" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M62.5 106.25V92.6471M87.5 106.25V74.0809C87.5 67.6849 81.9036 62.5 75 62.5C68.0964 62.5 62.5 67.6849 62.5 74.0809V79.0441" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M37.5 18.75H18.75V37.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M112.5 18.75H131.25V37.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M37.5 131.25H18.75V112.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M112.5 131.25H131.25V112.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <button className="usuario-editar-registrar-btn">Registrar</button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default EditarUsuario;
