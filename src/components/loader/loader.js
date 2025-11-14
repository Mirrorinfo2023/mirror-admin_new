import React from 'react';
import { Box, Typography, CircularProgress, LinearProgress } from '@mui/material';

const LoadingComponent = ({ 
  message = "Loading...", 
  size = 150,
  showText = true,
  type = "gif", // "gif", "spinner", "linear"
  overlay = true,
  fullScreen = true
}) => {
  
  const renderLoader = () => {
    switch (type) {
      case "spinner":
        return (
          <CircularProgress 
            size={size} 
            sx={{ 
              color: '#1976d2',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} 
          />
        );
      
      case "linear":
        return (
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <LinearProgress 
              sx={{ 
                height: 8,
                borderRadius: 4,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#1976d2',
                  borderRadius: 4,
                }
              }} 
            />
          </Box>
        );
      
      case "gif":
      default:
        return (
          <Box
            sx={{
              width: size,
              height: size,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <img 
              src="/loader.gif" 
              alt="Loading..." 
              width={size}
              height={size}
              style={{
                borderRadius: '50%',
                boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextSibling;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <Box
              sx={{
                width: size * 0.6,
                height: size * 0.6,
                border: '6px solid #f3f3f3',
                borderTop: '6px solid #1976d2',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                display: 'none',
              }}
              className="fallback-loader"
            />
          </Box>
        );
    }
  };

  const containerStyles = fullScreen ? {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 9999,
  } : {
    width: "100%",
    height: "100%",
    position: "relative",
  };

  const backgroundStyles = overlay ? {
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
  } : {
    background: "transparent",
  };

  return (
    <Box
      sx={{
        ...containerStyles,
        ...backgroundStyles,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box 
        sx={{ 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3
        }}
      >
        {renderLoader()}
        
        {showText && (
          <Typography 
            sx={{ 
              fontWeight: 600, 
              color: "#1976d2", 
              fontSize: type === 'linear' ? '1.1rem' : '1.3rem',
              textAlign: 'center'
            }}
          >
            {message}
          </Typography>
        )}
      </Box>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </Box>
  );
};

export default LoadingComponent;