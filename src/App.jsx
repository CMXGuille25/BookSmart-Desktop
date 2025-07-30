import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WebCamaraManager from './Componentes/WebManager.jsx';
import Detalle_Prestamo from './Detalle_Prestamo/Detalle_Prestamo.jsx';
import Inicio from './Inicio/Inicio.jsx';
import ConfirmarLogin from './Login/ConfirmarLogin.jsx';
import Login from './Login/Login.jsx';
import Buscar_Libros from './Nuevo_Préstamo/Buscar_Libros.jsx';

function App() {
  const [isCameraConnected, setIsCameraConnected] = useState(true);
  return (
    <BrowserRouter>
      <WebCamaraManager onCameraStatusChange={setIsCameraConnected} />

      {!isCameraConnected && (
        <div
          style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '6px',
            padding: '10px',
            textAlign: 'center',
            color: '#856404',
            fontWeight: 'bold',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999
          }}
        >
          ⚠️ Cámara USB desconectada. Por favor, conéctala para continuar.
        </div>
      )}
      <Routes>
        <Route path="/" element={<Login isCameraConnected={isCameraConnected} />} />
        <Route path="/ConfirmarLogin" element={<ConfirmarLogin />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Detalle_Prestamo" element={<Detalle_Prestamo />} />
        <Route path="/Buscar_Libros" element={<Buscar_Libros />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;