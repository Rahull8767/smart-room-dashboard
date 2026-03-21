import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Box, Paper } from '@mui/material';

const SensorCard = ({ title, icon: Icon, value, unit, status = 'inactive' }) => {
  const isActive = status === 'active' || status === 'alert';
  const isAlert = status === 'alert';
  
  // Minimal theme colors
  const iconColor = isAlert ? '#ef4444' : (isActive ? '#ffffff' : '#475569');
  const bgAlpha = isAlert ? 'rgba(239, 68, 68, 0.05)' : (isActive ? 'rgba(255, 255, 255, 0.03)' : 'transparent');

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: '#1c1f26',
        border: '1px solid',
        borderColor: isAlert ? 'rgba(239, 68, 68, 0.2)' : '#2a2d35',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: isAlert ? 'rgba(239, 68, 68, 0.4)' : '#3f4451',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: iconColor,
          opacity: isActive ? 1 : 0.6
        }}>
          <Icon sx={{ fontSize: 20 }} />
        </Box>
        <Typography sx={{ 
          fontSize: 12, 
          fontWeight: 600, 
          color: '#94a3b8', 
          textTransform: 'uppercase', 
          letterSpacing: '0.02em' 
        }}>
          {title}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography sx={{ 
          fontSize: 24, 
          fontWeight: 600, 
          color: isAlert ? '#ef4444' : '#f8fafc',
          lineHeight: 1
        }}>
          {value}
        </Typography>
        {unit && (
          <Typography sx={{ fontSize: 14, color: '#475569', fontWeight: 500 }}>
            {unit}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default SensorCard;
