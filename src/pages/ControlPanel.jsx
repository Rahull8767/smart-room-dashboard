import React, { useState } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import ControlButton from '../components/ControlButton';
import FanSlider from '../components/FanSlider';
import { useMqtt } from '../context/MqttContext';
import { useAppContext } from '../context/AppContext';

// Icons
import LightbulbRounded from '@mui/icons-material/LightbulbRounded';
import ModeFanOffRounded from '@mui/icons-material/ModeFanOffRounded';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';


const ControlPanel = () => {
  const { status, publishMessage, lights, fanSpeed, mqttClient } = useMqtt();
  const { settings } = useAppContext();
  const isConnected = status === 'connected';

  const [automationMode, setAutomationMode] = useState(false);

  const toggleLight = (id) => {
    if (id === 1) {
      console.log("Light button clicked");
      if (mqttClient.current && mqttClient.current.connected) {
        mqttClient.current.publish("room/light", "TOGGLE");
        console.log("Published TOGGLE to room/light");
      } else {
        console.log("MQTT not connected");
      }
    } else {
      publishMessage(`room/light${id}`, 'TOGGLE');
    }
  };
  const toggleFan = () => publishMessage('room/fan', fanSpeed !== 'OFF' ? 'OFF' : 'LOW');
  const changeFanSpeed = (speed) => publishMessage('room/fan', speed);

  const FAN_OPTS = [
    { label: 'OFF', value: 'OFF' },
    { label: 'LOW', value: 'LOW' },
    { label: 'MED', value: 'MEDIUM' },
    { label: 'HIGH', value: 'HIGH' }
  ];

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
        {/* Main Light */}
        <Grid item xs={12} sm={6}>
          <ControlButton 
            title="Main Light" 
            icon={LightbulbRounded} 
            isOn={lights[1]} 
            onClick={() => toggleLight(1)} 
          />
        </Grid>

        {/* Segmented Fan Control */}
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', mb: 2.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Climate
          </Typography>
          <Box sx={{ background: 'var(--card-bg)', p: 3, borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ModeFanOffRounded sx={{ color: fanSpeed !== 'OFF' ? 'var(--accent)' : 'var(--text-muted)', transition: 'color 0.4s ease' }} />
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{settings.deviceNames?.fan || 'Ceiling Fan'}</Typography>
              </Box>
            </Box>
            <FanSlider value={fanSpeed} onChange={changeFanSpeed} />
          </Box>
        </Grid>

        {/* Custom Matrix Lights (Light 2-6) */}
        {[2, 3, 4, 5, 6].map((id) => (
          <Grid item xs={12} sm={6} md={4} key={id}>
            <ControlButton 
              title={settings.deviceNames?.[`light${id}`] || `Light ${id}`} 
              icon={LightbulbRounded} 
              isOn={lights[id]} 
              onClick={() => toggleLight(id)} 
            />
          </Grid>
        ))}

        {/* Automation Mode */}
        <Grid item xs={12} sm={6} md={4}>
          <ControlButton 
            title="Automation Mode" 
            icon={AutoAwesomeRounded} 
            isOn={automationMode} 
            onClick={() => setAutomationMode(!automationMode)} 
          />
        </Grid>
      </Grid>

      {/* Device Summary Section */}
      <Box sx={{ p: 4, backgroundColor: '#1c1f26', border: '1px solid #2a2d35', borderRadius: 2 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', mb: 3, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Real-time Status
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[
            { label: 'Main Light', value: lights[1] ? 'ON' : 'OFF', active: lights[1] },
            { label: 'Fan State', value: fanSpeed, active: fanSpeed !== 'OFF' },
            { label: 'Automation', value: automationMode ? 'ACTIVE' : 'IDLE', active: automationMode },
          ].map(item => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: item.active ? '#10b981' : '#2a2d35' }} />
              <Typography sx={{ fontSize: 13, color: '#94a3b8' }}>
                {item.label}: <span style={{ color: item.active ? '#f8fafc' : '#64748b', fontWeight: 600 }}>{item.value}</span>
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ControlPanel;
