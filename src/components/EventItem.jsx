import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import SettingsRemoteRoundedIcon from '@mui/icons-material/SettingsRemoteRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { formatDistanceToNow } from 'date-fns';

const getTypeConfig = (type) => {
  switch (type) {
    case 'alert':       return { icon: NotificationsRoundedIcon, color: '#ef4444' };
    case 'command':     return { icon: SettingsRemoteRoundedIcon, color: 'var(--accent)' };
    case 'automation':  return { icon: AutoAwesomeRoundedIcon, color: 'var(--accent)' };
    default:            return { icon: InfoRoundedIcon, color: 'var(--text-muted)' };
  }
};

const EventItem = ({ event, index = 0 }) => {
  const { icon: Icon, color } = getTypeConfig(event.type);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        px: 2.5,
        py: 2,
        borderBottom: '1px solid var(--border-color)',
        transition: 'background 0.2s',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
        },
      }}
    >
      <Box sx={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        backgroundColor: 'var(--bg-color)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        flexShrink: 0,
      }}>
        <Icon sx={{ fontSize: 18 }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', mb: 0.2 }}>
          {event.description}
        </Typography>
        <Typography sx={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
          {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
        </Typography>
      </Box>

      {event.type === 'alert' && (
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 10px rgba(239,68,68,0.5)' }} />
      )}
    </Box>
  );
};

export default EventItem;
