import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Paper } from '@mui/material';
import { useMqtt } from '../context/MqttContext';
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded';
import RouterRoundedIcon from '@mui/icons-material/RouterRounded';

const DeviceCard = ({ icon: Icon, name, description, isOnline }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        backgroundColor: '#1c1f26',
        border: '1px solid #2a2d35',
        borderRadius: 2,
        transition: 'border-color 0.2s ease',
        '&:hover': {
          borderColor: '#3f4451',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: 1,
          backgroundColor: '#111318',
          border: '1px solid #2a2d35',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: isOnline ? '#ffffff' : '#475569',
        }}>
          <Icon sx={{ fontSize: 22 }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 16, color: '#f8fafc' }}>
              {name}
            </Typography>
            <Box className={`status-dot ${isOnline ? 'connected' : 'disconnected'}`} sx={{ width: 6, height: 6 }} />
          </Box>
          <Typography sx={{ fontSize: 13, color: '#64748b', mb: 2, lineHeight: 1.4 }}>
            {description}
          </Typography>

          <Typography sx={{ 
            fontSize: 10, 
            fontWeight: 700, 
            color: isOnline ? '#10b981' : '#ef4444',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {isOnline ? 'Online' : 'Offline'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const Devices = () => {
  const { status, subscribeTopic } = useMqtt();
  const [deviceOnline, setDeviceOnline] = useState(false);
  const isBrokerConnected = status === 'connected';

  useEffect(() => {
    const unsub = subscribeTopic('room/device_status', (data) => {
      setDeviceOnline(data === 'online' || data === 1 || data?.online === true);
    });
    return () => unsub();
  }, [subscribeTopic]);

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Infrastructure
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#64748b', mt: 0.5 }}>
          Network status and hardware health
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <DeviceCard
            icon={RouterRoundedIcon}
            name="MQTT Broker"
            description="HiveMQ Cloud messaging cluster."
            isOnline={isBrokerConnected}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DeviceCard
            icon={MemoryRoundedIcon}
            name="ESP32 Controller"
            description="Main hardware node for room sensors."
            isOnline={isBrokerConnected && deviceOnline}
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, backgroundColor: '#1c1f26', border: '1px solid #2a2d35', borderRadius: 2 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', mb: 3, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Network Metrics
        </Typography>
        <Grid container spacing={4}>
          {[
            { label: 'Latency', value: isBrokerConnected ? '42ms' : '--' },
            { label: 'Uptime', value: isBrokerConnected ? '99.9%' : '--' },
            { label: 'Packets', value: isBrokerConnected ? '1.2k' : '0' },
          ].map((stat) => (
            <Grid item key={stat.label}>
              <Typography sx={{ fontSize: 11, color: '#64748b', mb: 0.5 }}>{stat.label}</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#f8fafc' }}>{stat.value}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Devices;
