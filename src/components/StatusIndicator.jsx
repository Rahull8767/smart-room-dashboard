import React from 'react';
import { Box, Typography } from '@mui/material';

const StatusIndicator = ({ status, label }) => {
  const isConnected = status === 'connected';
  
  return (
    <Box sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1.2,
      px: 1.5,
      py: 0.6,
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid #2a2d35',
      borderRadius: '100px',
    }}>
      <Box 
        className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} 
        sx={{ width: 6, height: 6 }} 
      />
      <Typography sx={{ 
        fontSize: 11, 
        fontWeight: 600, 
        color: isConnected ? '#10b981' : '#ef4444',
        textTransform: 'uppercase',
        letterSpacing: '0.02em'
      }}>
        {label}
      </Typography>
    </Box>
  );
};

export default StatusIndicator;
