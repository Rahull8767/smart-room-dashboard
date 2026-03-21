import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const ControlButton = ({ title, icon: Icon, isOn, onClick, disabled = false }) => {
  return (
    <Paper
      elevation={0}
      onClick={!disabled ? onClick : undefined}
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: disabled ? 'default' : 'pointer',
        backgroundColor: '#1c1f26',
        border: '1px solid',
        borderColor: isOn ? 'rgba(255, 255, 255, 0.2)' : '#2a2d35',
        borderRadius: 8,
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.5 : 1,
        '&:hover': {
          borderColor: isOn ? 'rgba(255, 255, 255, 0.4)' : '#3f4451',
          background: 'rgba(255, 255, 255, 0.02)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: isOn ? '#ffffff' : '#475569',
          opacity: isOn ? 1 : 0.6
        }}>
          <Icon sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#f8fafc', lineHeight: 1.2 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 500, color: '#64748b', mt: 0.2 }}>
            {isOn ? 'Active' : 'Standby'}
          </Typography>
        </Box>
      </Box>

      {/* Minimal Pill Switch */}
      <Box className={`pill-switch ${isOn ? 'active' : ''}`}>
        <Box className="thumb" />
      </Box>
    </Paper>
  );
};

export default ControlButton;
