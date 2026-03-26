import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper } from '@mui/material';

const ControlButton = ({ title, icon: Icon, isOn: serverIsOn, onClick, disabled = false }) => {
  const [optimisticState, setOptimisticState] = useState(serverIsOn);

  useEffect(() => {
    setOptimisticState(serverIsOn);
  }, [serverIsOn]);
  const handleToggle = (e) => {
    if (!disabled) {
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(20);
      setOptimisticState(!optimisticState);
      if (onClick) onClick(e);
    }
  };

  const isOn = optimisticState;

  return (
    <Paper
      elevation={0}
      onClick={handleToggle}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: 110,
        cursor: disabled ? 'default' : 'pointer',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isOn ? '0 0 20px var(--accent-glow)' : 'none',
        borderRadius: '16px',
        transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        opacity: disabled ? 0.5 : 1,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: isOn ? 'var(--accent)' : 'var(--text-muted)',
          transition: 'color 0.4s ease'
        }}>
          <Icon sx={{ fontSize: 24 }} />
        </Box>
        {/* Minimal Pill Switch */}
        <Box className={`pill-switch ${isOn ? 'active' : ''}`}>
          <Box className="thumb" />
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 500, color: isOn ? 'var(--accent)' : 'var(--text-muted)', mt: 0.3 }}>
          {isOn ? 'On' : 'Off'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ControlButton;
