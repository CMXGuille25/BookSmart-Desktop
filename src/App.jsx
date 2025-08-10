import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CambiarContraseña from './Cambiar_Contraseña/CambiarContraseña.jsx';
import CameraStream from './Componentes/CamaraStream.jsx';
import WebCamaraManager from './Componentes/WebManager.jsx';
import Confirmar_Prestamo from './Detalle_Prestamo/Confirmar_Prestamo.jsx';
import Detalle_Prestamo from './Detalle_Prestamo/Detalle_Prestamo.jsx';
import Escanear_Huella_Usuario from './Escanear_Tarjeta_Usuario/Escanear_Huella_Usuario.jsx';
import Escanear_Tarjeta_Usuario from './Escanear_Tarjeta_Usuario/Escanear_Tarjeta_Usuario.jsx';
import Inicio from './Inicio/Inicio.jsx';
import ConfirmarLogin from './Login/ConfirmarLogin.jsx';
import Login from './Login/Login.jsx';
import Buscar_Libros from './Nuevo_Préstamo/Buscar_Libros.jsx';
import BuscarUsuarioEmail from './Usuario/Buscar_Usuario_Correo.jsx';
import Buscar_Usuarios from './Usuario/Buscar_Usuarios.jsx';
import Editar_Usuario from './Usuario/Editar_Usuario.jsx';
import Registrar_Usuario from './Usuario/Registrar_Usuario.jsx';


function App() {
  const [isCameraConnected, setIsCameraConnected] = useState(false);
  const [cameraAllowed, setCameraAllowed] = useState(false);

  useEffect(() => {
    // Check initial camera permission state
    const allowed = localStorage.getItem('camera_allowed') === 'true';
    setCameraAllowed(allowed);

    // Listen for changes
    const handleStorage = () => {
      const allowed = localStorage.getItem('camera_allowed') === 'true';
      setCameraAllowed(allowed);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <WebCamaraManager onCameraStatusChange={(status) => {
        setIsCameraConnected(status);
        // Only show camera stream if we have both connection and permission
        if (status) {
          setCameraAllowed(true);
        }
      }} />
      
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

      {cameraAllowed && isCameraConnected && (
        <CameraStream />
      )}

      <Routes>
        <Route path="/" element={<Login   />} />
        <Route path="/Usuarios" element={<Buscar_Usuarios />} />
        <Route path="/Editar_Usuario" element={<Editar_Usuario />} />
        <Route path="/ConfirmarLogin" element={<ConfirmarLogin />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Detalle_Prestamo" element={<Detalle_Prestamo />} />
        <Route path="/Escanear_Tarjeta_Usuario" element={<Escanear_Tarjeta_Usuario />} />
        <Route path="/Buscar_Libros" element={<Buscar_Libros />} />
        <Route path="/Confirmar_Prestamo" element={<Confirmar_Prestamo />} />
        <Route path="/Registrar_Usuario" element={<Registrar_Usuario />} />
        <Route path="/Escanear_Huella_Usuario" element={<Escanear_Huella_Usuario />} />
        <Route path="/Cambiar_Contraseña" element={<CambiarContraseña />} />
        <Route path="/Buscar_Usuario_Email" element={<BuscarUsuarioEmail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;