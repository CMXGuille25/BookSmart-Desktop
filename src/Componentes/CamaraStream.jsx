import * as faceDetection from '@tensorflow-models/face-detection';
import * as tf from '@tensorflow/tfjs';
import { useEffect, useRef, useState } from 'react';

const CameraStream = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const bibliotecaId = localStorage.getItem('biblioteca');
  const [isStreaming, setIsStreaming] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  // Initialize TensorFlow and face detector
  const initializeDetector = async () => {
    try {
      // Initialize TensorFlow backend
      await tf.setBackend('webgl');
      await tf.ready();
      console.log("🚀 TensorFlow initialized with backend:", tf.getBackend());

      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig = {
        runtime: 'tfjs',
        maxFaces: 5, // Increased to catch more faces
        modelType: 'short', // Use 'short' for faster detection
        minDetectionConfidence: 0.3, // Lower threshold for better detection
        minSuppressionThreshold: 0.3
      };
      
      detectorRef.current = await faceDetection.createDetector(model, detectorConfig);
      console.log("🎭 Face detector initialized with config:", detectorConfig);
    } catch (err) {
      console.error("❌ Error initializing TensorFlow:", err);
      throw err;
    }
  };

  // Detect faces in video stream
  const detectFaces = async () => {
    if (!videoRef.current || !detectorRef.current) {
      console.log("🚫 Detection skipped - missing requirements:", {
        hasVideo: !!videoRef.current,
        hasDetector: !!detectorRef.current,
        isStreaming: isStreaming
      });
      return;
    }

    // Make sure video is actually playing and has dimensions
    if (videoRef.current.readyState < 2 || videoRef.current.videoWidth === 0) {
      console.log("⏳ Video not ready yet:", {
        readyState: videoRef.current.readyState,
        videoWidth: videoRef.current.videoWidth,
        videoHeight: videoRef.current.videoHeight,
        currentTime: videoRef.current.currentTime,
        paused: videoRef.current.paused
      });
      setTimeout(() => {
        requestAnimationFrame(detectFaces);
      }, 500);
      return;
    }

    try {
      const faces = await detectorRef.current.estimateFaces(videoRef.current, {
        flipHorizontal: false,
        staticImageMode: false
      });

      const hasFace = faces.length > 0;
      
      if (hasFace) {
        const face = faces[0];
        console.log("👤 Face detected:", {
          confidence: face.score?.toFixed(3),
          box: face.box,
          keypoints: face.keypoints?.length || 0,
          videoInfo: {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
            currentTime: videoRef.current.currentTime
          }
        });
      }

      setFaceDetected(hasFace);
      
      if (hasFace && !faceDetected) {
        console.log("✅ New face detected!");
      }

      // Continue detection loop at ~15 FPS (67ms delay)
      setTimeout(() => {
        requestAnimationFrame(detectFaces);
      }, 67); // ~15 FPS (1000ms / 15 ≈ 67ms)

    } catch (err) {
      console.error("❌ Face detection error:", err);
      console.log("🔧 Error details:", {
        message: err.message,
        stack: err.stack,
        videoElement: {
          readyState: videoRef.current?.readyState,
          videoWidth: videoRef.current?.videoWidth,
          videoHeight: videoRef.current?.videoHeight
        }
      });
      // Retry detection after error
      setTimeout(() => {
        requestAnimationFrame(detectFaces);
      }, 1000);
    }
  };

  useEffect(() => {
    const startStream = async () => {
      try {
        await initializeDetector();

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
          video: { 
            deviceId: { exact: usbCamera.deviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          
          // Wait for video to be ready before playing
          videoRef.current.onloadedmetadata = async () => {
            try {
              console.log("📹 Video metadata loaded, dimensions:", {
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight,
                readyState: videoRef.current.readyState
              });
              
              await videoRef.current.play();
              console.log("🎥 Stream started successfully");
              
              // Set streaming state first
              setIsStreaming(true);
              
              // Wait a bit more for the video to stabilize and state to update before starting detection
              setTimeout(() => {
                console.log("🔍 Starting face detection...");
                detectFaces();
              }, 1500); // Increased wait time to ensure state update
            } catch (playError) {
              console.error("Error playing video:", playError);
            }
          };
          
          // Add error handler for video element
          videoRef.current.onerror = (e) => {
            console.error("Video element error:", e);
          };
        }

      } catch (err) {
        console.error('Error starting video stream:', err.message);
        setIsStreaming(false);
      }
    };

    startStream();

    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => {
          console.log("Stopping track:", track.label);
          track.stop();
        });
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setIsStreaming(false);
        setFaceDetected(false);
        console.log("🛑 Stream stopped and cleaned up");
      }
    };
  }, []);

  return (
    <>
      <video 
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="640"
        height="480"
        style={{ 
          display: 'none', // Hidden but still functional for face detection
          position: 'fixed',
          zIndex: -1
        }}
      />
      {isStreaming && (
        <div
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '5px 10px',
            borderRadius: '15px',
            color: 'white',
            fontSize: '12px',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: faceDetected ? '#00ff00' : '#ff0000',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}
          />
          <style>
            {`
              @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
              }
            `}
          </style>
          <span>Cámara activa {faceDetected ? '(Rostro detectado)' : ''}</span>
        </div>
      )}
    </>
  );
};

export default CameraStream;
