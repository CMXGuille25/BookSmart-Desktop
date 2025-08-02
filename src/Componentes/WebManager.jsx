import { useEffect, useState } from 'react';

const WebCamaraManager = ({ onCameraStatusChange }) => {
  const [isCameraConnected, setIsCameraConnected] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // First request general camera permissions
        await navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            // Immediately stop the test stream
            stream.getTracks().forEach(track => track.stop());
            console.log('📸 Camera permissions granted');
          });
        
        return true;
      } catch (err) {
        console.error('❌ Camera permission denied:', err.message);
        return false;
      }
    };

    const checkForUSBCamera = async () => {
      try {
        // First ensure we have permissions
        const hasPermissions = await requestPermissions();
        if (!hasPermissions) {
          setIsCameraConnected(false);
          onCameraStatusChange?.(false);
          return;
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        console.log('📝 Available cameras:', videoInputs.map(d => d.label));

        // Find USB camera with stricter criteria
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

        // Test the specific USB camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: usbCamera.deviceId }
          }
        });

        // Stop the test stream immediately
        stream.getTracks().forEach(track => track.stop());

        console.log('✅ USB camera detected and accessible:', usbCamera.label);
        localStorage.setItem('camera_allowed', 'true');
        setIsCameraConnected(true);
        onCameraStatusChange?.(true);

      } catch (err) {
        console.error('❌ Camera access error:', err.message);
        localStorage.setItem('camera_allowed', 'false');
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
