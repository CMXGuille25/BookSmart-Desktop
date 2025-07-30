// src/Componentes/WebCamaraManager.jsx
import { useEffect, useState } from 'react';

const WebCamaraManager = ({ onCameraStatusChange }) => {
  const [isCameraConnected, setIsCameraConnected] = useState(true);

  useEffect(() => {
    const checkForUSBCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === 'videoinput');

        const usbCamera = videoInputs.find(device =>
          !device.label.toLowerCase().includes('integrated') &&
          !device.label.toLowerCase().includes('built-in')
        );

        const isConnected = !!usbCamera;
        setIsCameraConnected(isConnected);
        onCameraStatusChange?.(isConnected);
      } catch (err) {
        console.error('Error detecting camera:', err);
        setIsCameraConnected(false);
        onCameraStatusChange?.(false);
      }
    };

    checkForUSBCamera();
    const interval = setInterval(checkForUSBCamera, 5000); // checks every 5 seconds
    return () => clearInterval(interval);
  }, [onCameraStatusChange]);

  return null; // it’s just logic, nothing to display
};

export default WebCamaraManager;
