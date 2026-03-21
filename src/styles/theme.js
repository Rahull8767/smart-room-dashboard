import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const baseTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    background: {
      default: '#111318',
      paper: '#1c1f26',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    divider: '#2a2d35',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#111318',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1c1f26',
          backgroundImage: 'none',
          border: '1px solid #2a2d35',
          borderRadius: 8,
          boxShadow: 'none',
          transition: 'border-color 0.2s ease',
          '&:hover': {
            borderColor: '#3f4451',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1c1f26',
          backgroundImage: 'none',
          border: '1px solid #2a2d35',
          borderRadius: 8,
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 16px',
        },
        contained: {
          backgroundColor: '#ffffff',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#e2e8f0',
          },
        },
        outlined: {
          borderColor: '#2a2d35',
          '&:hover': {
            borderColor: '#ffffff',
            background: 'rgba(255,255,255,0.05)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111318',
          borderRight: '1px solid #2a2d35',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#111318',
          borderBottom: '1px solid #2a2d35',
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderLeft: '2px solid #ffffff',
            borderRadius: '0 6px 6px 0',
            color: '#ffffff',
            '& .MuiListItemIcon-root': {
              color: '#ffffff',
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
          },
        },
      },
    },
  },
});

const theme = responsiveFontSizes(baseTheme);
export default theme;
