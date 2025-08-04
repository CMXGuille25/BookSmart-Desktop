import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login/Login.jsx'
import ConfirmarLogin from './Login/ConfirmarLogin.jsx';
import Inicio from './Inicio/Inicio.jsx';
import Detalle_Prestamo from './Detalle_Prestamo/Detalle_Prestamo.jsx';
import Buscar_Libros from './Nuevo_Préstamo/Buscar_Libros.jsx';
import Escanear_Tarjeta_Usuario from './Escanear_Tarjeta_Usuario/Escanear_Tarjeta_Usuario.jsx';
import Buscar_Usuarios from './Usuario/Buscar_Usuarios.jsx';
import Confirmar_Prestamo from './Detalle_Prestamo/Confirmar_Prestamo.jsx';
import Editar_Usuario from './Usuario/Editar_Usuario.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Usuarios" element={<Buscar_Usuarios />} />
        <Route path="/Editar_Usuario" element={<Editar_Usuario />} />
        <Route path="/ConfirmarLogin" element={<ConfirmarLogin />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Detalle_Prestamo" element={<Detalle_Prestamo />} />
        <Route path="/Escanear_Tarjeta_Usuario" element={<Escanear_Tarjeta_Usuario />} />
        <Route path="/Buscar_Libros" element={<Buscar_Libros />} />
        <Route path="/Confirmar_Prestamo" element={<Confirmar_Prestamo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;