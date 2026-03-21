import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Snackbar, Alert, Paper, Grid } from '@mui/material';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { useAppContext } from '../context/AppContext';

const DEFAULT_SETTINGS = {
  brokerUrl: '',
  username: '',
  password: '',
  roomName: 'room1',
};

const normalizeSettings = (settings) => ({
  ...DEFAULT_SETTINGS,
  ...(settings && typeof settings === 'object' ? settings : {}),
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

class SettingsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Settings page render error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      const errorMessage = this.state.error?.message || 'Unknown Settings page error';

      return (
        <Box sx={{ maxWidth: 800 }}>
          <Paper sx={{ p: 4, backgroundColor: '#1c1f26', border: '1px solid #ef4444', borderRadius: 2 }}>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em', mb: 1 }}>
              Settings Error
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#94a3b8', mb: 2 }}>
              The Settings page hit a render error instead of loading.
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'monospace',
                fontSize: 12,
                lineHeight: 1.5,
                color: '#fca5a5',
                backgroundColor: '#111318',
                border: '1px solid #2a2d35',
                borderRadius: 1,
              }}
            >
              {errorMessage}
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

const SettingsContent = () => {
  const appContext = useAppContext();
  const settings = normalizeSettings(appContext?.settings);
  const updateSettings = typeof appContext?.updateSettings === 'function'
    ? appContext.updateSettings
    : () => {};

  const [formData, setFormData] = useState(() => normalizeSettings(settings));
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    setFormData(normalizeSettings(settings));
  }, [settings.brokerUrl, settings.username, settings.password, settings.roomName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateSettings(formData);
    setOpenSnackbar(true);
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Box sx={{ mb: 5 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Settings
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#64748b', mt: 0.5 }}>
          Configure system and connection parameters
        </Typography>
      </Box>

      <Paper sx={{ p: 5, backgroundColor: '#1c1f26', border: '1px solid #2a2d35', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <WifiRoundedIcon sx={{ color: '#ffffff', fontSize: 18 }} />
              <Typography sx={{ fontWeight: 600, color: '#f8fafc', fontSize: 15 }}>Network Configuration</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Field
                label="Broker URL"
                name="brokerUrl"
                value={formData.brokerUrl}
                onChange={handleChange}
                helperText="WSS Endpoint for MQTT HiveMQ Cloud."
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field label="Username" name="username" value={formData.username} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box sx={{ height: '1px', backgroundColor: '#2a2d35' }} />

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <MeetingRoomRoundedIcon sx={{ color: '#ffffff', fontSize: 18 }} />
              <Typography sx={{ fontWeight: 600, color: '#f8fafc', fontSize: 15 }}>Room Preferences</Typography>
            </Box>
            <Field
              label="Room Display Name"
              name="roomName"
              value={formData.roomName}
              onChange={handleChange}
              helperText="The label shown at the top of the dashboard."
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={<SaveRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{ py: 1.5, px: 3, fontSize: 14, fontWeight: 600 }}
            >
              Save Configuration
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{
            backgroundColor: '#1c1f26',
            border: '1px solid #10b981',
            color: '#10b981',
            '& .MuiAlert-icon': { color: '#10b981' },
          }}
        >
          Configuration saved successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
};

const Settings = () => (
  <SettingsErrorBoundary>
    <SettingsContent />
  </SettingsErrorBoundary>
);

export default Settings;
