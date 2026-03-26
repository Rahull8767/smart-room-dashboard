import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';

const RingGraph = ({ percentage, label, color, subtitle }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="120" height="120" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle cx="60" cy="60" r={radius} stroke="var(--border-color)" strokeWidth="8" fill="none" />
          <circle cx="60" cy="60" r={radius} stroke={color} strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out', filter: `drop-shadow(0 0 6px ${color}80)` }} />
        </svg>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{percentage}%</Typography>
          <Typography sx={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{label}</Typography>
        </Box>
      </Box>
      {subtitle && <Typography sx={{ mt: 2, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{subtitle}</Typography>}
    </Box>
  );
};

const Energy = () => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Energy Hub
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'var(--text-muted)', mt: 0.5 }}>
          Real-time power consumption analytics
        </Typography>
      </Box>

      {/* Main Stats */}
      <Paper sx={{ p: 4, mb: 4, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 4, elevation: 0, textAlign: 'center' }}>
         <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
           <Box sx={{ p: 2, borderRadius: '50%', background: 'var(--accent-light)' }}>
             <BoltRoundedIcon sx={{ fontSize: 32, color: 'var(--accent)' }} />
           </Box>
         </Box>
         <Typography sx={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
           1.2<span style={{ fontSize: 16, color: 'var(--text-muted)', marginLeft: 4 }}>kW/h</span>
         </Typography>
         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1.5 }}>
           <TrendingDownRoundedIcon sx={{ fontSize: 14, color: 'var(--accent)' }} />
           <Typography sx={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>12% less than yesterday</Typography>
         </Box>
      </Paper>

      {/* Rings Grid */}
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', mb: 2.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Device Distribution
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper sx={{ py: 3, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 4, elevation: 0, height: '100%' }}>
             <RingGraph percentage={65} label="Climate" color="var(--accent)" subtitle="0.78 kW/h" />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ py: 3, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 4, elevation: 0, height: '100%' }}>
             <RingGraph percentage={35} label="Lighting" color="#3b82f6" subtitle="0.42 kW/h" />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Energy;
