import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <aside className="sidebar">
      <div className="hola-bibliotecario">Hola, bibliotecario</div>
      <div className="sidebar-divider" />
      <div className="menu-item menu-inicio" onClick={() => navigate('/Inicio')} style={{ cursor: 'pointer' }}>
        <svg className="sidebar-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34" fill="none">
          <path d="M14.1666 25.5V20.4167C14.1666 19.3121 15.0621 18.4167 16.1666 18.4167H17.8333C18.9379 18.4167 19.8333 19.3121 19.8333 20.4167V25.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.83337 11.3333L16.7317 4.38417C16.9006 4.29971 17.0995 4.29971 17.2684 4.38417L31.1667 11.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M28.3333 15.5833V27.75C28.3333 28.8546 27.4379 29.75 26.3333 29.75H7.66663C6.56206 29.75 5.66663 28.8546 5.66663 27.75V15.5833" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Inicio</span>
      </div>
      <div className="menu-item menu-usuarios" onClick={() => navigate('/Usuarios')} style={{ cursor: 'pointer' }}>
        <svg className="sidebar-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34" fill="none">
          <path d="M7.08337 28.3333V24C7.08337 20.134 10.2174 17 14.0834 17H19.9167C23.7827 17 26.9167 20.134 26.9167 24V28.3333" stroke="#FEF7FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 17C20.1297 17 22.6667 14.4629 22.6667 11.3333C22.6667 8.20371 20.1297 5.66666 17 5.66666C13.8704 5.66666 11.3334 8.20371 11.3334 11.3333C11.3334 14.4629 13.8704 17 17 17Z" stroke="#FEF7FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Usuarios</span>
      </div>
      <div className="menu-item menu-cambiar">
        <svg className="sidebar-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34" fill="none">
          <path d="M17 21.25C19.3472 21.25 21.25 19.3472 21.25 17C21.25 14.6528 19.3472 12.75 17 12.75C14.6528 12.75 12.75 14.6528 12.75 17C12.75 19.3472 14.6528 21.25 17 21.25Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M27.7984 14.7268L26.2434 10.9718L28.3334 8.49998L25.5 5.66665L23.0417 7.7675L19.2069 6.19044L18.3251 2.83331H15.5564L14.6612 6.23491L10.9146 7.81426L8.50004 5.66665L5.66671 8.49998L7.72564 11.0342L6.19442 14.7989L2.83337 15.5833V18.4166L6.23495 19.3453L7.81402 23.0913L5.66671 25.5L8.50004 28.3333L11.0375 26.2654L14.7291 27.7841L15.5834 31.1666H18.4167L19.2731 27.7853L23.0281 26.2303C23.6539 26.6777 25.5 28.3333 25.5 28.3333L28.3334 25.5L26.2309 23.02L27.7864 19.2638L31.1665 18.3843L31.1667 15.5833L27.7984 14.7268Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Cambiar Contraseña</span>
      </div>
      <div className="sidebar-divider" />
      <div className="menu-item cerrar-sesion">
        <svg className="sidebar-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" fill="none">
          <path d="M17.5 17.5H27.7084M27.7084 17.5L23.3334 21.875M27.7084 17.5L23.3334 13.125" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M27.7083 8.75V6.375C27.7083 5.27043 26.8129 4.375 25.7083 4.375H9.29162C8.18705 4.375 7.29163 5.27043 7.29163 6.375V28.625C7.29163 29.7296 8.18706 30.625 9.29163 30.625H25.7083C26.8129 30.625 27.7083 29.7296 27.7083 28.625V26.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Cerrar sesión</span>
      </div>
    </aside>
  );
};

export default Sidebar;
