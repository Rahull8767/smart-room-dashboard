import { useNavigate, useLocation, useOutlet } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import { useMqtt } from '../context/MqttContext';
import { useAppContext } from '../context/AppContext';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { useEffect } from 'react';

const mobileBottomNavItems = [
  { text: 'Dashboard', icon: DashboardRoundedIcon, path: '/' },
  { text: 'Controls', icon: TuneRoundedIcon, path: '/control' },
  { text: 'Energy', icon: BoltRoundedIcon, path: '/energy' },
  { text: 'Timeline', icon: TimelineRoundedIcon, path: '/timeline' },
  { text: 'Settings', icon: SettingsRoundedIcon, path: '/settings' },
];

const isPathActive = (pathname, path) => (
  path === '/'
    ? pathname === '/'
    : pathname === path || pathname.startsWith(`${path}/`)
);

const getActiveNavPath = (pathname) => (
  mobileBottomNavItems.find((item) => isPathActive(pathname, item.path))?.path ?? pathname
);

const MobileBottomNav = ({ activePath, navigate }) => (
  <Box
    component="nav"
    aria-label="Bottom navigation"
    sx={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1100,
      display: 'flex',
      alignItems: 'stretch',
      gap: 0.5,
      width: '100%',
      px: 1.5,
      pt: 1,
      minHeight: '60px',
      pb: 'calc(12px + env(safe-area-inset-bottom))',
      backgroundColor: 'rgba(4, 6, 8, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border-color)',
    }}
  >
    {mobileBottomNavItems.map((item) => {
      const Icon = item.icon;
      const isActive = activePath === item.path;

      return (
        <Box
          key={item.text}
          component="button"
          type="button"
          aria-current={isActive ? 'page' : undefined}
          onClick={() => navigate(item.path)}
          sx={{
            flex: 1,
            minWidth: 0,
            border: 0,
            background: 'transparent',
            p: 0,
            m: 0,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.35,
              width: '100%',
              minHeight: 56,
              px: 1,
              py: 0.9,
              borderRadius: '14px',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
              transition: 'color 180ms ease, background-color 180ms ease',
            }}
          >
            <Icon sx={{ fontSize: 20, color: 'inherit' }} />
            <Typography
              component="span"
              sx={{
                fontSize: 10,
                lineHeight: 1.2,
                fontWeight: isActive ? 700 : 500,
                color: 'inherit',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
                width: '100%',
                textAlign: 'center'
              }}
            >
              {item.text}
            </Typography>
          </Box>
        </Box>
      );
    })}
  </Box>
);

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();
  const { status, offlineMode } = useMqtt();
  const { settings } = useAppContext();

  const isConnected = status === 'connected';
  const roomName = settings?.roomName || 'Bedroom';
  const activePath = getActiveNavPath(location.pathname);

  useEffect(() => {
    if (offlineMode) {
      document.body.classList.add('offline-theme');
    } else {
      document.body.classList.remove('offline-theme');
    }
  }, [offlineMode]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: 'var(--bg-color)', overflowX: 'hidden' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            pt: 'calc(16px + env(safe-area-inset-top))',
            pb: 2,
            borderBottom: '1px solid #2a2d35',
            backgroundColor: 'rgba(4, 6, 8, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>
                {roomName}
              </Typography>
              <Box className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} sx={{ width: 10, height: 10 }} />
            </Box>

            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500, ml: 1 }}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
            
            {offlineMode && (
              <Box sx={{ ml: 2, px: 1.5, py: 0.5, borderRadius: 999, backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', letterSpacing: '0.05em' }}>
                  OFFLINE
                </Typography>
              </Box>
            )}
          </Box>

          <IconButton
            onClick={() => navigate('/settings')}
            size="small"
            sx={{ color: '#64748b', '&:hover': { color: '#ffffff' } }}
          >
            <SettingsRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

          <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: 2,
            pt: 2,
            pb: '100px', // Exact scroll view fix for mobile safe area requested
            width: '100%',
            overflowX: 'hidden',
            boxSizing: 'border-box',
            mx: 'auto',
          }}
        >
          <Box key={location.pathname} sx={{ width: '100%' }}>
            {outlet}
          </Box>
        </Box>
      </Box>

      <MobileBottomNav activePath={activePath} navigate={navigate} />
    </Box>
  );
};

export default Layout;
