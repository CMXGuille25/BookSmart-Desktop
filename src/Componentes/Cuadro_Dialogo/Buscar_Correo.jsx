import React from 'react';
import './Buscar_Correo.css';

const BuscarCorreo = ({ onSubmit }) => {
  return (
    <div className="cuadro-dialogo-overlay">
      <div className="cuadro-dialogo-bg">
        <h2 className="cuadro-dialogo-titulo">Ingresar correo</h2>
        <form className="cuadro-dialogo-form" onSubmit={onSubmit}>
          <div className="cuadro-dialogo-search-bar">
            <input
              type="email"
              className="cuadro-dialogo-input"
              placeholder="Ingresa un correo electrónico"
              required
            />
            <button type="submit" className="cuadro-dialogo-search-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#453726" strokeWidth="2" />
                <path d="M21 21L17 17" stroke="#453726" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <button type="submit" className="cuadro-dialogo-siguiente-btn">Siguiente</button>
        </form>
      </div>
    </div>
  );
};

export default BuscarCorreo;
