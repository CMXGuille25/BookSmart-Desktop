import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login/Login.jsx'
import ConfirmarLogin from './Login/ConfirmarLogin.jsx';
import Inicio from './Inicio/Inicio.jsx';
import Detalle_Prestamo from './Detalle_Prestamo/Detalle_Prestamo.jsx';
import Buscar_Libros from './Nuevo_Préstamo/Buscar_Libros.jsx';
import Escanear_Tarjeta_Usuario from './Escanear_Tarjeta_Usuario/Escanear_Tarjeta_Usuario.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ConfirmarLogin" element={<ConfirmarLogin />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Detalle_Prestamo" element={<Detalle_Prestamo />} />
        <Route path="/Buscar_Libros" element={<Buscar_Libros />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;