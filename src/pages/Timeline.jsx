import React from 'react';
import { Typography, Box, List, Button, Paper } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
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
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Event Timeline
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#64748b', mt: 0.5 }}>
            {events.length} event{events.length !== 1 ? 's' : ''} recorded in total
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />}
          onClick={clearEvents}
          disabled={events.length === 0}
          sx={{ py: 1, px: 2, fontSize: 12, color: '#ef4444', borderColor: '#2a2d35', '&:hover': { borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' } }}
        >
          Clear History
        </Button>
      </Box>

      {/* Timeline List */}
      <Paper sx={{ backgroundColor: '#1c1f26', border: '1px solid #2a2d35', borderRadius: 2, overflow: 'hidden' }}>
        {events.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, px: 4 }}>
            <AccessTimeRoundedIcon sx={{ fontSize: 32, color: '#2a2d35', mb: 2 }} />
            <Typography sx={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>
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
