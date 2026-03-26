import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button, Slider } from '@mui/material';
import SensorCard from '../components/SensorCard';
import ControlButton from '../components/ControlButton';
import FanSlider from '../components/FanSlider';
import { useMqtt } from '../context/MqttContext';
import { useAppContext } from '../context/AppContext';

// Icons
import DirectionsRunRounded from '@mui/icons-material/DirectionsRunRounded';
import MeetingRoomRounded from '@mui/icons-material/MeetingRoomRounded';
import DeviceThermostatRounded from '@mui/icons-material/DeviceThermostatRounded';
import WaterDropRounded from '@mui/icons-material/WaterDropRounded';
import LightbulbRounded from '@mui/icons-material/LightbulbRounded';
import ModeFanOffRounded from '@mui/icons-material/ModeFanOffRounded';
import HearingRounded from '@mui/icons-material/HearingRounded';
import TransferWithinAStationRounded from '@mui/icons-material/TransferWithinAStationRounded';
import SettingsRemoteRounded from '@mui/icons-material/SettingsRemoteRounded';

const MOODS = [
  { name: 'Morning', emoji: '☀️' },
  { name: 'Study', emoji: '📚' },
  { name: 'Night', emoji: '🌙' },
  { name: 'Movie', emoji: '🎬' },
  { name: 'Sleep', emoji: '😴' },
  { name: 'Away', emoji: '🏃' },
];

const Complication = ({ label, value, percent, gradient, isMotion, isConnected }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const safePercent = Math.min(Math.max(percent || 0, 0), 100);
  const strokeDashoffset = isMotion || label === 'Network' ? 0 : circumference - (safePercent / 100) * circumference;
  
  const isMotionActive = isMotion && value === 'Detected';
  const isNetworkActive = label === 'Network' && isConnected;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ position: 'relative', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradient?.[0]} />
              <stop offset="100%" stopColor={gradient?.[1]} />
            </linearGradient>
          </defs>
          <circle cx="28" cy="28" r={radius} fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          
          <circle cx="28" cy="28" r={radius} fill="transparent"
            stroke={isMotion ? (isMotionActive ? 'var(--accent)' : 'transparent') : (label === 'Network' ? (isNetworkActive ? 'var(--accent)' : '#ef4444') : `url(#grad-${label})`)}
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 1s ease-in-out',
              animation: isMotionActive ? 'pulseGlow 2s infinite' : 'none',
              opacity: (label === 'Network' && !isConnected) ? 0.3 : 1
            }}
          />
        </svg>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff', zIndex: 1 }}>
          {label === 'Network' ? (isNetworkActive ? 'ON' : 'OFF') : (isMotion ? (isMotionActive ? 'YES' : 'NO') : value)}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label === 'Network' ? 'MQTT' : label}
      </Typography>
    </Box>
  );
};

const SegmentedControl = ({ value, onChange, options }) => {
  return (
    <Box sx={{ display: 'flex', background: '#111318', borderRadius: '8px', overflow: 'hidden', width: '100%', mt: 1.5 }}>
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <Box
            key={opt.value}
            onClick={() => onChange(opt.value)}
            sx={{
              flex: 1, 
              py: 0.8, 
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center', 
              borderRadius: '8px', 
              cursor: 'pointer',
              background: isActive ? '#10b981' : 'transparent',
              color: isActive ? '#0D1117' : '#64748b',
              transition: 'all 0.2s ease'
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>
              {opt.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

const Dashboard = () => {
  const { status, publishMessage, subscribeTopic, lights, fanSpeed, activeMood, setMood, motionStatus, mqttClient } = useMqtt();
  const { settings } = useAppContext();

  const [temperature, setTemperature] = useState('--');
  const [humidity, setHumidity] = useState('--');
  const [soundStatus, setSoundStatus] = useState('Clear');
  const [door, setDoor] = useState('Closed');
  
  // Note: lights/fan states are managed universally by MqttContext to handle auto moods and syncing between tabs.

  useEffect(() => {
    const unsubTemp = subscribeTopic('room/temp', (data) => setTemperature(typeof data === 'object' ? data.value ?? data : data));
    const unsubHumidity = subscribeTopic('room/humidity', (data) => setHumidity(typeof data === 'object' ? data.value ?? data : data));
    const unsubSound = subscribeTopic('room/sound', (data) => {
      const detected = data === 'Detected' || data === 'ON' || data === 1 || data?.value === 1 || data?.state === 'detected';
      setSoundStatus(detected ? 'Detected' : 'Clear');
    });
    const unsubDoor = subscribeTopic('room/door', (data) => {
      const open = data === 'open' || data === 'OPEN' || data?.state === 'open';
      setDoor(open ? 'Open' : 'Closed');
    });
    return () => { unsubTemp(); unsubHumidity(); unsubSound(); unsubDoor(); };
  }, [subscribeTopic]);

  const toggleMainLight = () => publishMessage('room/light', lights[0] ? 'OFF' : 'ON'); 
  // Wait, the new logic uses `room/light1` to `room/light6`, but original uses `room/light`. 
  // We will assume Main Light = `room/light1`, or just use the existing topic structure.
  // The context handles `light1` to `light6`. I will map Main light to `light1`.
  
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

      {/* ── Complication Row ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: 1 }}>
        <Complication 
           label="Temp" 
           value={temperature !== '--' ? `${temperature}°` : '--'} 
           percent={temperature !== '--' ? Math.min((parseInt(temperature) / 40) * 100, 100) : 0} 
           gradient={['#3b82f6', '#f97316']} // Blue to Orange
        />
        <Complication 
           label="Humidity" 
           value={humidity !== '--' ? `${humidity}%` : '--'} 
           percent={humidity !== '--' ? parseInt(humidity) : 0} 
           gradient={['#06b6d4', '#3b82f6']} // Cyan to Blue
        />
        <Complication 
           label="Motion" 
           value={motionStatus} 
           isMotion={true} 
        />
        <Complication 
           label="Network" 
           isConnected={isConnected} 
        />
      </Box>

      {/* ── Moods & Controls ── */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 1.2,
            overflowX: 'auto',
            pb: 1,
            mb: 2,
            WebkitOverflowScrolling: 'touch',
            '::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {MOODS.map(m => {
            const isActive = activeMood === m.name;
            return (
              <Box
                key={m.name}
                onClick={() => setMood(m.name)}
                sx={{
                  flexShrink: 0,
                  px: 2,
                  py: 0.8,
                  borderRadius: 999,
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)',
                  border: isActive ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: isActive ? '0 0 12px var(--accent-glow)' : 'none',
                  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  userSelect: 'none'
                }}
              >
                <Typography sx={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--accent)' : 'var(--text-primary)' }}>
                  {m.emoji} {m.name}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Grid container spacing={1.5}>
          {/* Main Light & Fan Only */}
          <Grid item xs={6}>
            <ControlButton title="Main Light" icon={LightbulbRounded} isOn={lights[1]} onClick={() => toggleLight(1)} />
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(15px)', p: 2, borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 110, border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: fanSpeed !== 'OFF' ? '0 0 20px var(--accent-light)' : 'none', transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <ModeFanOffRounded sx={{ color: fanSpeed !== 'OFF' ? 'var(--accent)' : 'var(--text-muted)', transition: 'color 0.4s ease' }} />
                 </Box>
              </Box>
              <Box sx={{ mt: 'auto', pt: 1 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{settings.deviceNames?.fan || 'Ceiling Fan'}</Typography>
                <Typography sx={{ fontSize: 11, fontWeight: 500, color: fanSpeed !== 'OFF' ? 'var(--accent)' : 'var(--text-muted)', mt: 0.3 }}>{fanSpeed === 'OFF' ? 'Off' : fanSpeed}</Typography>
              </Box>
              <Box sx={{ mx: -1.5, mt: 0.5 }}>
                 <FanSlider value={fanSpeed} onChange={changeFanSpeed} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

    </Box>
  );
};

export default Dashboard;
