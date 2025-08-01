import { useEffect, useState } from 'react';

const WebCamaraManager = ({ onCameraStatusChange }) => {
  const [isCameraConnected, setIsCameraConnected] = useState(false); // Start with false by default

  useEffect(() => {
    const checkForUSBCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        console.log('📝 Available cameras:', videoInputs.map(d => d.label));

        // Find USB camera
        const usbCamera = videoInputs.find(device => 
          device.label && 
          !device.label.toLowerCase().includes('integrated') &&
          !device.label.toLowerCase().includes('built-in') &&
          (
            device.label.toLowerCase().includes('usb') ||
            device.label.toLowerCase().includes('webcam') ||
            device.label.toLowerCase().includes('camera')
          )
        );

        if (!usbCamera) {
          console.warn('⚠️ No USB camera found');
          setIsCameraConnected(false);
          onCameraStatusChange?.(false);
          return;
        }

        // Try to access specifically the USB camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: usbCamera.deviceId }
          }
        });

        // Stop the test stream immediately
        stream.getTracks().forEach(track => track.stop());

        console.log('✅ USB camera detected and accessible:', usbCamera.label);
        setIsCameraConnected(true);
        onCameraStatusChange?.(true);

      } catch (err) {
        console.error('❌ Camera access error:', err.message);
        setIsCameraConnected(false);
        onCameraStatusChange?.(false);
      }
    };

    // Initial check
    checkForUSBCamera();

    // Set up device change listener
    const handleDeviceChange = () => {
      console.log('🔄 Device change detected, checking USB camera...');
      checkForUSBCamera();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [onCameraStatusChange]);

  return null;
};

export default WebCamaraManager;
