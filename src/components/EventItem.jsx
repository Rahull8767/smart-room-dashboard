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
    case 'command':     return { icon: SettingsRemoteRoundedIcon, color: '#f8fafc' };
    case 'automation':  return { icon: AutoAwesomeRoundedIcon, color: '#f8fafc' };
    default:            return { icon: InfoRoundedIcon, color: '#64748b' };
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
        px: 2,
        py: 1.5,
        borderBottom: '1px solid #2a2d35',
        transition: 'background 0.2s',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
        },
      }}
    >
      <Box sx={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        backgroundColor: '#111318',
        border: '1px solid #2a2d35',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        flexShrink: 0,
      }}>
        <Icon sx={{ fontSize: 16 }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#f8fafc', mb: 0.2 }}>
          {event.description}
        </Typography>
        <Typography sx={{ fontSize: 11, color: '#64748b' }}>
          {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
        </Typography>
      </Box>

      {event.type === 'alert' && (
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ef4444' }} />
      )}
    </Box>
  );
};

export default EventItem;
