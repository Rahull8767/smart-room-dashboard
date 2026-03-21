import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import SensorCard from '../components/SensorCard';
import ControlButton from '../components/ControlButton';
import { useMqtt } from '../context/MqttContext';

// Icons
import DirectionsRunRounded from '@mui/icons-material/DirectionsRunRounded';
import MeetingRoomRounded from '@mui/icons-material/MeetingRoomRounded';
import DeviceThermostatRounded from '@mui/icons-material/DeviceThermostatRounded';
import WaterDropRounded from '@mui/icons-material/WaterDropRounded';
import LightbulbRounded from '@mui/icons-material/LightbulbRounded';
import ModeFanOffRounded from '@mui/icons-material/ModeFanOffRounded';

const Dashboard = () => {
  const { status, publishMessage, subscribeTopic } = useMqtt();

  const [temperature, setTemperature] = useState('--');
  const [humidity, setHumidity] = useState('--');
  const [motionStatus, setMotionStatus] = useState('Clear');
  const [door, setDoor] = useState('Closed');
  const [lightStatus, setLightStatus] = useState(false);
  const [fanStatus, setFanStatus] = useState(false);

  useEffect(() => {
    const unsubTemp = subscribeTopic('room/temp', (data) => {
      setTemperature(typeof data === 'object' ? data.value ?? data : data);
    });
    const unsubHumidity = subscribeTopic('room/humidity', (data) => {
      setHumidity(typeof data === 'object' ? data.value ?? data : data);
    });
    const unsubMotion = subscribeTopic('room/motion', (data) => {
      const detected = data === 'Detected' || data === 'ON' || data === 1 || data?.value === 1 || data?.state === 'detected';
      setMotionStatus(detected ? 'Detected' : 'Clear');
    });
    const unsubDoor = subscribeTopic('room/door', (data) => {
      const open = data === 'open' || data === 'OPEN' || data?.state === 'open';
      setDoor(open ? 'Open' : 'Closed');
    });
    const unsubLight = subscribeTopic('room/light', (data) => {
      setLightStatus(data === 'ON' || data === 1 || data?.state === 1);
    });
    const unsubFan = subscribeTopic('room/fan', (data) => {
      setFanStatus(data === 'ON' || data === 1 || data?.state === 1);
    });
    return () => { unsubTemp(); unsubHumidity(); unsubMotion(); unsubDoor(); unsubLight(); unsubFan(); };
  }, [subscribeTopic]);

  const toggleLight = () => publishMessage('room/light', lightStatus ? 'OFF' : 'ON');
  const toggleFan = () => publishMessage('room/fan', fanStatus ? 'OFF' : 'ON');
  const isConnected = status === 'connected';

  return (
    <Box>
      {/* ── Header ── */}
      <Box sx={{ mb: 5 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Room Overview
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#64748b', mt: 0.5 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      {/* ── Sensors ── */}
      <Box sx={{ mb: 6 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', mb: 2.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Sensors
        </Typography>
        <Grid container spacing={2}>
          {[
            { title: 'Motion', icon: DirectionsRunRounded, value: motionStatus, unit: '', status: motionStatus === 'Detected' ? 'alert' : 'inactive' },
            { title: 'Door',   icon: MeetingRoomRounded,   value: door,   unit: '', status: door === 'Open' ? 'alert' : 'inactive' },
            { title: 'Temperature', icon: DeviceThermostatRounded, value: temperature, unit: temperature === '--' ? '' : '°C', status: 'active' },
            { title: 'Humidity',    icon: WaterDropRounded,         value: humidity,    unit: humidity === '--' ? '' : '%',    status: 'active' },
          ].map((s) => (
            <Grid item xs={12} sm={6} md={3} key={s.title}>
              <SensorCard {...s} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Controls ── */}
      <Box sx={{ mb: 6 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', mb: 2.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Device Controls
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ControlButton title="Main Light" icon={LightbulbRounded} isOn={lightStatus} onClick={toggleLight} disabled={!isConnected} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ControlButton title="Ceiling Fan" icon={ModeFanOffRounded} isOn={fanStatus} onClick={toggleFan} disabled={!isConnected} />
          </Grid>
        </Grid>
      </Box>

      {/* ── Footer / Tools ── */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="outlined"
          size="small"
          disabled={!isConnected}
          onClick={() => publishMessage('test/topic', 'Hello ESP32')}
          sx={{ py: 1, px: 2, fontSize: 12 }}
        >
          Test Connection
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
