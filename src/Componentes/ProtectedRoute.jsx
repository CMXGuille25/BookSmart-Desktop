import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { checkSessionHealth, clearAuthData, isAuthenticated } from '../utils/auth.js';

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateSession = async () => {
      try {
        // Check if user has basic authentication
        if (!isAuthenticated()) {
          console.warn('⚠️ No authentication found, redirecting to login');
          setIsValid(false);
          setIsChecking(false);
          return;
        }

        // Check session health (token + biblioteca_id)
        if (!checkSessionHealth()) {
          console.warn('⚠️ Session health check failed, redirecting to login');
          setIsValid(false);
          setIsChecking(false);
          return;
        }

        // If we reach here, session is valid
        console.log('✅ Session validated successfully');
        setIsValid(true);
        setIsChecking(false);

      } catch (error) {
        console.error('❌ Session validation error:', error);
        clearAuthData();
        setIsValid(false);
        setIsChecking(false);
      }
    };

    validateSession();
  }, [location.pathname]); // Re-validate on route change

  // Show loading while checking
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #3B82F6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{
          color: '#666',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Validando sesión...
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  // Render protected component
  return children;
};

export default ProtectedRoute;