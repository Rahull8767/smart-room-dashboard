import React from 'react';
import { Typography, Box, List, Button, Paper, Grid } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded';
import NetworkCheckRoundedIcon from '@mui/icons-material/NetworkCheckRounded';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import EventItem from '../components/EventItem';
import { useAppContext } from '../context/AppContext';

const Timeline = () => {
  const { events, clearEvents } = useAppContext();

  return (
    <Box>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 2,
        mb: 5,
      }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Event Timeline
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'var(--text-muted)', mt: 0.5 }}>
            {events.length} event{events.length !== 1 ? 's' : ''} recorded in total
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />}
          onClick={clearEvents}
          disabled={events.length === 0}
          sx={{ py: 1, px: 2, fontSize: 12, color: '#ef4444', borderColor: 'var(--border-color)', borderRadius: 2, '&:hover': { borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' } }}
        >
          Clear History
        </Button>
      </Box>

      {/* Hardware Diagnostics Widget */}
      <Box sx={{ mb: 6 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', mb: 2.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Hardware Diagnostics
        </Typography>
        <Paper sx={{ p: 3, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 4, elevation: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
             <Box sx={{ p: 1.5, background: 'var(--accent-light)', borderRadius: 2 }}>
               <MemoryRoundedIcon sx={{ color: 'var(--accent)' }} />
             </Box>
             <Box>
                <Typography sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>ESP32 Node MCU</Typography>
                <Typography sx={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600 }}>Connected to HiveMQ</Typography>
             </Box>
          </Box>
          <Grid container spacing={2}>
             <Grid item xs={4}>
                <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px solid var(--border-color)', textAlign: 'center' }}>
                   <AccessTimeRoundedIcon sx={{ color: 'var(--text-muted)', fontSize: 18, mb: 1 }} />
                   <Typography sx={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700 }}>99.9%</Typography>
                   <Typography sx={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', fontWeight: 600 }}>Uptime</Typography>
                </Box>
             </Grid>
             <Grid item xs={4}>
                <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px solid var(--border-color)', textAlign: 'center' }}>
                   <NetworkCheckRoundedIcon sx={{ color: 'var(--accent)', fontSize: 18, mb: 1 }} />
                   <Typography sx={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700 }}>42ms</Typography>
                   <Typography sx={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', fontWeight: 600 }}>Latency</Typography>
                </Box>
             </Grid>
             <Grid item xs={4}>
                <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px solid var(--border-color)', textAlign: 'center' }}>
                   <SwapVertRoundedIcon sx={{ color: '#3b82f6', fontSize: 18, mb: 1 }} />
                   <Typography sx={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700 }}>1.2k</Typography>
                   <Typography sx={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', fontWeight: 600 }}>Packets</Typography>
                </Box>
             </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Timeline List */}
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', mb: 2.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Activity Stream
      </Typography>
      <Paper sx={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 4, overflow: 'hidden', elevation: 0 }}>
        {events.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, px: 4 }}>
            <AccessTimeRoundedIcon sx={{ fontSize: 32, color: 'var(--text-muted)', opacity: 0.5, mb: 2 }} />
            <Typography sx={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>
              No activities tracked yet.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {events.map((event, i) => (
              <EventItem key={event.id} event={event} index={i} />
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default Timeline;
