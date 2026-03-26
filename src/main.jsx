import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider, CssBaseline, Box, Typography, Paper } from '@mui/material';
import theme from './styles/theme';
import { AppProvider } from './context/AppContext';
import { MqttProvider } from './context/MqttContext';

import './index.css';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('CRITICAL CAUGHT ERROR:', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', backgroundColor: '#0D1117', minHeight: '100vh', width: '100%' }}>
          <Paper sx={{ p: 4, backgroundColor: '#1C2333', border: '1px solid #ef4444', borderRadius: 2, maxWidth: 800, width: '100%' }}>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', mb: 1 }}>
              White Screen Crash Captured!
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#94a3b8', mb: 2 }}>
              The application crashed during render. Here is the exact stack trace:
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace',
                fontSize: 12, color: '#fca5a5', backgroundColor: '#0D1117', border: '1px solid #2a2d35', borderRadius: 1
              }}
            >
              {this.state.error && this.state.error.toString()}
              {'\n\n'}
              {this.state.info && this.state.info.componentStack}
            </Box>
          </Paper>
        </Box>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProvider>
          <MqttProvider>
            <App />
          </MqttProvider>
        </AppProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  </React.StrictMode>,
);
