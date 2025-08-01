import { useEffect, useRef, useState } from 'react';

const CameraStream = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const bibliotecaId = localStorage.getItem('biblioteca');
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const startStream = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        console.log("📷 Available video inputs:", videoInputs.map(d => d.label));

        const usbCamera = videoInputs.find(device =>
          !device.label.toLowerCase().includes('integrated') &&
          !device.label.toLowerCase().includes('built-in')
        );

        if (!usbCamera) {
          console.error('❌ USB camera not found');
          throw new Error('USB camera not found');
        }

        console.log("✅ Selected camera:", usbCamera.label);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: usbCamera.deviceId }
        });

        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
          console.log("🎥 Stream started successfully");
        }

      } catch (err) {
        console.error('Error starting video stream:', err.message);
        setIsStreaming(false);
      }
    };

    startStream();

    // Cleanup function
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
        console.log("🛑 Stream stopped and cleaned up");
      }
    };
  }, []);

  return (
    <video 
      ref={videoRef}
      autoPlay
      playsInline
      muted
      width="640"
      height="480"
      style={{ display: 'none' }}
      onLoadedMetadata={() => console.log("📹 Video element ready")}
    />
  );
};

export default CameraStream;
