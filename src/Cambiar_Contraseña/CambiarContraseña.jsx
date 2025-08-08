// Componente para input de contraseña con ícono de mostrar/ocultar
const PasswordInput = ({ placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative', width: '350px', marginBottom: '18px' }}>
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        style={{
          width: '350px',
          height: '42px',
          borderRadius: '10px',
          border: '1px solid rgba(69, 55, 38, 0.15)',
          background: '#FFF',
          padding: '0 40px 0 16px',
          fontSize: '20px',
          fontFamily: 'League Spartan, sans-serif',
          color: '#453726',
          outline: 'none',
        }}
      />
      <span
        onClick={() => setShow(s => !s)}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          color: '#453726',
        }}
      >
        {/* SVG ojito */}
        {show ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12C2.73 7.61 7.11 4.5 12 4.5C16.89 4.5 21.27 7.61 23 12C21.27 16.39 16.89 19.5 12 19.5C7.11 19.5 2.73 16.39 1 12Z" stroke="#453726" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="#453726" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12C2.73 7.61 7.11 4.5 12 4.5C16.89 4.5 21.27 7.61 23 12C21.27 16.39 16.89 19.5 12 19.5C7.11 19.5 2.73 16.39 1 12Z" stroke="#453726" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="#453726" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="4" y1="20" x2="20" y2="4" stroke="#453726" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </span>
    </div>
  );
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Componentes/Sidebar/Sidebar.jsx';
import './CambiarContraseña.css';


const CambiarContraseña = () => {
  const navigate = useNavigate();
  return (
    <div className="usuario-editar-bg">
      <Sidebar />
      <main className="main-content">
        <h1 className="cambiar-titulo">Cambiar Contraseña</h1>
        <hr className="usuario-prestamos-divider cambiar-divider" />
        <div className="cambiar-marron">
          <div className="cambiar-interno">
            <div className="cambiar-instruccion">
              Ingresa los siguientes datos para Cambiar Contraseña
            </div>
            <div className="cambiar-label">
              <span>Ingresa tu correo</span>
            </div>
            <input
              type="email"
              placeholder="Correo@mail.com"
              className="cambiar-input"
              required
            />
            <div className="cambiar-label">
              <span>Contraseña actual</span>
            </div>
            <PasswordInput placeholder="" />
            <div className="cambiar-label cambiar-label-nueva">
              <span>nueva contraseña</span>
            </div>
            <PasswordInput placeholder="" />
          </div>
        </div>
        {/* Botón Cambiar perfectamente centrado debajo del cuadro */}
        <div className="cambiar-boton-contenedor">
          <button
            type="button"
            className="cambiar-boton"
            onClick={() => navigate('/Inicio')}
          >
            Cambiar
          </button>
        </div>
      </main>
    </div>
  );
};

export default CambiarContraseña;
