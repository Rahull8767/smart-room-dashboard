import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './styles/theme';
import { AppProvider } from './context/AppContext';
import { MqttProvider } from './context/MqttContext';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <MqttProvider>
          <App />
        </MqttProvider>
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
