import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Snackbar, Alert, Paper, Grid, Switch } from '@mui/material';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import SettingsInputComponentRoundedIcon from '@mui/icons-material/SettingsInputComponentRounded';
import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded';
import { useAppContext } from '../context/AppContext';
import { useMqtt } from '../context/MqttContext';

const DEFAULT_SETTINGS = {
  brokerUrl: '',
  username: '',
  password: '',
  roomName: 'room1',
  deviceNames: {
    light1: 'Light 1',
    light2: 'Light 2',
    light3: 'Light 3',
    light4: 'Light 4',
    light5: 'Light 5',
    light6: 'Light 6',
    fan: 'Ceiling Fan'
  }
};

const normalizeSettings = (settings) => ({
  ...DEFAULT_SETTINGS,
  ...(settings && typeof settings === 'object' ? settings : {}),
  deviceNames: { ...DEFAULT_SETTINGS.deviceNames, ...(settings?.deviceNames || {}) }
});

const Field = ({ label, name, value, onChange, type = 'text', helperText }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
      {label}
    </Typography>
    <Box
      component="input"
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete="off"
      sx={{
        backgroundColor: '#111318',
        border: '1px solid #2a2d35',
        borderRadius: 1,
        color: '#f8fafc',
        fontSize: 14,
        p: '12px 16px',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
        '&:focus': {
          borderColor: '#ffffff',
        },
        '&::placeholder': { color: '#2a2d35' },
      }}
    />
    {helperText && (
      <Typography sx={{ fontSize: 11, color: '#475569', opacity: 0.8 }}>
        {helperText}
      </Typography>
    )}
  </Box>
);

const SettingsContent = () => {
  const appContext = useAppContext();
  const { offlineMode, setOfflineMode } = useMqtt();
  
  const settings = normalizeSettings(appContext?.settings);
  const updateSettings = typeof appContext?.updateSettings === 'function' ? appContext.updateSettings : () => {};

  const [formData, setFormData] = useState(() => normalizeSettings(settings));
  const [username, setUsername] = useState("rahull");
  const [password, setPassword] = useState("Rahul@123");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showOfflineSteps, setShowOfflineSteps] = useState(false);

  const deviceNamesJson = JSON.stringify(settings.deviceNames);
  useEffect(() => {
    setFormData(normalizeSettings(settings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.brokerUrl, settings.username, settings.password, settings.roomName, deviceNamesJson]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeviceNameChange = (key, value) => {
    setFormData(prev => ({ ...prev, deviceNames: { ...prev.deviceNames, [key]: value } }));
  };

  const handleSave = () => {
    updateSettings({ ...formData, username, password });
    setOpenSnackbar(true);
  };

  const toggleOfflineSwitch = (e) => {
    const checked = e.target.checked;
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(20);
    if (checked) {
      setShowOfflineSteps(true);
    } else {
      setOfflineMode(false);
      setShowOfflineSteps(false);
    }
  };

  const confirmOffline = () => {
    setOfflineMode(true);
    setShowOfflineSteps(false);
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Box sx={{ mb: 5 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Settings
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'var(--text-muted)', mt: 0.5 }}>
          Configure system and connection parameters
        </Typography>
      </Box>

      <Paper sx={{ p: 5, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 4, elevation: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <WifiRoundedIcon sx={{ color: 'var(--accent)', fontSize: 18 }} />
              <Typography sx={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 15 }}>Network Configuration</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Field label="Broker URL" name="brokerUrl" value={formData.brokerUrl} onChange={handleChange} helperText="WSS Endpoint for MQTT HiveMQ Cloud." />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field label="Username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box sx={{ height: '1px', backgroundColor: 'var(--border-color)' }} />

          {/* Operation Mode */}
          <Box>
            <Paper elevation={0} sx={{ p: 3, backgroundColor: offlineMode || showOfflineSteps ? 'var(--accent-light)' : 'var(--bg-color)', border: offlineMode || showOfflineSteps ? '1px solid var(--accent)' : '1px solid var(--border-color)', borderRadius: 3, transition: 'all 0.3s ease', cursor: 'pointer' }} onClick={() => toggleOfflineSwitch({ target: { checked: !(offlineMode || showOfflineSteps) } })}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.5, background: offlineMode || showOfflineSteps ? 'var(--accent)' : 'var(--border-color)', borderRadius: '50%', color: offlineMode || showOfflineSteps ? '#000' : 'var(--text-muted)', display: 'flex' }}>
                    <CloudOffRoundedIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: offlineMode || showOfflineSteps ? 'var(--accent)' : 'var(--text-primary)' }}>Local Fallback</Typography>
                    <Typography sx={{ fontSize: 12, color: 'var(--text-muted)', mt: 0.5 }}>Direct HTTP connection to ESP32</Typography>
                  </Box>
                </Box>
                <Switch checked={offlineMode || showOfflineSteps} onChange={(e) => { e.stopPropagation(); toggleOfflineSwitch(e); }} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'var(--accent-glow)' } }} />
              </Box>
            </Paper>

            {showOfflineSteps && (
              <Box sx={{ mt: 2, p: 3, backgroundColor: 'var(--bg-color)', borderRadius: 3, border: '1px solid var(--border-color)' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)', mb: 2 }}>Connect to Local Hotspot</Typography>
                <ol style={{ paddingLeft: 20, margin: 0, color: 'var(--text-primary)', fontSize: 14, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>Go to your phone WiFi settings.</li>
                  <li>Connect to <strong>ESP32_Light</strong>.</li>
                  <li>Enter password <strong>12345678</strong>.</li>
                </ol>
                <Button variant="contained" onClick={confirmOffline} sx={{ mt: 3, backgroundColor: 'var(--accent)', color: '#000', fontWeight: 700, borderRadius: 2, '&:hover': { backgroundColor: 'var(--accent)' } }}>
                  Yes, I'm Connected
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ height: '1px', backgroundColor: 'var(--border-color)' }} />

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <MeetingRoomRoundedIcon sx={{ color: '#ffffff', fontSize: 18 }} />
              <Typography sx={{ fontWeight: 600, color: '#f8fafc', fontSize: 15 }}>Room Preferences</Typography>
            </Box>
            <Field label="Room Display Name" name="roomName" value={formData.roomName} onChange={handleChange} helperText="The label shown at the top of the dashboard." />
          </Box>

          <Box sx={{ height: '1px', backgroundColor: '#2a2d35' }} />

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <SettingsInputComponentRoundedIcon sx={{ color: '#ffffff', fontSize: 18 }} />
              <Typography sx={{ fontWeight: 600, color: '#f8fafc', fontSize: 15 }}>Device Names</Typography>
            </Box>
            <Grid container spacing={2}>
              {[1, 2, 3, 4, 5, 6].map((id) => (
                 <Grid item xs={12} sm={6} key={id}>
                   <Field label={`Light ${id}`} value={formData.deviceNames[`light${id}`] || ''} onChange={(e) => handleDeviceNameChange(`light${id}`, e.target.value)} />
                 </Grid>
              ))}
              <Grid item xs={12} sm={6}>
                 <Field label="Ceiling Fan" value={formData.deviceNames.fan || ''} onChange={(e) => handleDeviceNameChange('fan', e.target.value)} />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" onClick={handleSave} startIcon={<SaveRoundedIcon sx={{ fontSize: 16 }} />} sx={{ py: 1.5, px: 3, fontSize: 14, fontWeight: 600 }}>
              Save Configuration
            </Button>
          </Box>

        </Box>
      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ backgroundColor: '#1c1f26', border: '1px solid #10b981', color: '#10b981', '& .MuiAlert-icon': { color: '#10b981' } }}>
          Configuration saved successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsContent;
