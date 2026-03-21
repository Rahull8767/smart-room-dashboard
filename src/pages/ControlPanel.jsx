import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper } from '@mui/material';
import ControlButton from '../components/ControlButton';
import { useMqtt } from '../context/MqttContext';

// Icons
import LightbulbRounded from '@mui/icons-material/LightbulbRounded';
import ModeFanOffRounded from '@mui/icons-material/ModeFanOffRounded';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';

const ControlPanel = () => {
  const { status, publishMessage, subscribeTopic } = useMqtt();
  const isConnected = status === 'connected';

  const [light, setLight] = useState('OFF');
  const [fan, setFan] = useState('OFF');
  const [automationMode, setAutomationMode] = useState(false);

  useEffect(() => {
    const unsubLight = subscribeTopic('room/light', (data) => {
      setLight(data === 'ON' || data === 1 ? 'ON' : 'OFF');
    });
    const unsubFan = subscribeTopic('room/fan', (data) => {
      setFan(data === 'ON' || data === 1 ? 'ON' : 'OFF');
    });
    return () => { unsubLight(); unsubFan(); };
  }, [subscribeTopic]);

  const toggleLight = () => publishMessage('room/light', light === 'ON' ? 'OFF' : 'ON');
  const toggleFan = () => publishMessage('room/fan', fan === 'ON' ? 'OFF' : 'ON');

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Control Panel
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#64748b', mt: 0.5 }}>
          Manage your room devices and modes
        </Typography>
      </Box>

      {/* Grid */}
      <Grid container spacing={2} sx={{ mb: 6 }}>
        {[
          { title: 'Main Light', icon: LightbulbRounded, isOn: light === 'ON', onClick: toggleLight, disabled: !isConnected },
          { title: 'Ceiling Fan', icon: ModeFanOffRounded, isOn: fan === 'ON', onClick: toggleFan, disabled: !isConnected },
          { title: 'Automation Mode', icon: AutoAwesomeRounded, isOn: automationMode, onClick: () => setAutomationMode(!automationMode) },
        ].map((device) => (
          <Grid item xs={12} sm={6} md={4} key={device.title}>
            <ControlButton {...device} />
          </Grid>
        ))}
      </Grid>

      {/* Device Summary Section */}
      <Box sx={{ p: 4, backgroundColor: '#1c1f26', border: '1px solid #2a2d35', borderRadius: 2 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', mb: 3, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Real-time Status
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[
            { label: 'Light', value: light, active: light === 'ON' },
            { label: 'Fan', value: fan, active: fan === 'ON' },
            { label: 'Automation', value: automationMode ? 'ACTIVE' : 'IDLE', active: automationMode },
          ].map(item => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: item.active ? '#ffffff' : '#2a2d35' }} />
              <Typography sx={{ fontSize: 13, color: '#94a3b8' }}>
                {item.label}: <span style={{ color: item.active ? '#ffffff' : '#64748b', fontWeight: 600 }}>{item.value}</span>
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ControlPanel;
