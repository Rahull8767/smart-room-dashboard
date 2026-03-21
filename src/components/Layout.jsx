import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useMqtt } from '../context/MqttContext';
import { useAppContext } from '../context/AppContext';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';

const DRAWER_WIDTH = 220;
const DESKTOP_QUERY = '@media (min-width:768px)';

const sidebarMenuItems = [
  { text: 'Dashboard', icon: DashboardRoundedIcon, path: '/' },
  { text: 'Controls', icon: TuneRoundedIcon, path: '/control' },
  { text: 'Timeline', icon: TimelineRoundedIcon, path: '/timeline' },
  { text: 'Automation', icon: AutoAwesomeRoundedIcon, path: '/automation' },
  { text: 'Devices', icon: DevicesRoundedIcon, path: '/devices' },
  { text: 'Settings', icon: SettingsRoundedIcon, path: '/settings' },
];

const mobileBottomNavItems = [
  { text: 'Dashboard', icon: DashboardRoundedIcon, path: '/' },
  { text: 'Controls', icon: TuneRoundedIcon, path: '/control' },
  { text: 'Timeline', icon: TimelineRoundedIcon, path: '/timeline' },
  { text: 'Settings', icon: SettingsRoundedIcon, path: '/settings' },
];

const isPathActive = (pathname, path) => (
  path === '/'
    ? pathname === '/'
    : pathname === path || pathname.startsWith(`${path}/`)
);

const NavItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        width: '100%',
        px: 2.5,
        py: 1,
        mb: 0.5,
        cursor: 'pointer',
        color: isActive ? '#ffffff' : '#94a3b8',
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        borderLeft: isActive ? '3px solid #ffffff' : '3px solid transparent',
        transition: 'all 0.2s ease',
        '&:hover': {
          color: '#ffffff',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
        },
      }}
    >
      <Icon sx={{ fontSize: 18, opacity: isActive ? 1 : 0.7 }} />
      <Typography sx={{ fontSize: 13, fontWeight: isActive ? 600 : 500, letterSpacing: '0.01em' }}>
        {item.text}
      </Typography>
    </Box>
  );
};

const SidebarContent = ({ location, navigate }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: 3 }}>
    <Box sx={{ px: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, color: '#ffffff', letterSpacing: '-0.5px' }}>
        SmartRoom
      </Typography>
    </Box>

    <Box sx={{ flex: 1 }}>
      {sidebarMenuItems.map((item) => (
        <NavItem
          key={item.text}
          item={item}
          isActive={isPathActive(location.pathname, item.path)}
          onClick={() => navigate(item.path)}
        />
      ))}
    </Box>

    <Box sx={{ px: 3, py: 3, borderTop: '1px solid #2a2d35' }}>
      <Typography sx={{ color: '#475569', fontSize: 11, fontWeight: 500 }}>
        v1.0.2 - ESP32
      </Typography>
    </Box>
  </Box>
);

const MobileBottomNav = ({ location, navigate }) => (
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
      pb: 'calc(12px + env(safe-area-inset-bottom))',
      backgroundColor: '#1c1f26',
      borderTop: '1px solid #2a2d35',
      [DESKTOP_QUERY]: {
        display: 'none',
      },
    }}
  >
    {mobileBottomNavItems.map((item) => {
      const Icon = item.icon;
      const isActive = isPathActive(location.pathname, item.path);

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
              color: isActive ? '#3b82f6' : '#6b7280',
              backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              transition: 'color 180ms ease, background-color 180ms ease',
            }}
          >
            <Icon sx={{ fontSize: 20, color: 'inherit' }} />
            <Typography
              component="span"
              sx={{
                fontSize: 11,
                lineHeight: 1.2,
                fontWeight: isActive ? 600 : 500,
                color: 'inherit',
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
  const { status } = useMqtt();
  const { settings } = useAppContext();

  const isConnected = status === 'connected';
  const roomName = settings?.roomName || 'Bedroom';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#111318' }}>
      <Box
        component="nav"
        sx={{
          width: 0,
          flexShrink: 0,
          display: 'none',
          borderRight: '1px solid #2a2d35',
          [DESKTOP_QUERY]: {
            width: DRAWER_WIDTH,
            display: 'block',
          },
        }}
      >
        <Box sx={{ width: DRAWER_WIDTH, height: '100vh', position: 'fixed', left: 0, top: 0 }}>
          <SidebarContent location={location} navigate={navigate} />
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 2,
            borderBottom: '1px solid #2a2d35',
            backgroundColor: '#111318',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            [DESKTOP_QUERY]: {
              px: 4,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 16, color: '#f8fafc' }}>
                {roomName}
              </Typography>
              <Box className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} sx={{ width: 10, height: 10 }} />
            </Box>

            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500, ml: 1 }}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
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
            pb: 'calc(var(--mobile-bottom-nav-height) + env(safe-area-inset-bottom))',
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
            [DESKTOP_QUERY]: {
              px: 4,
              pt: 4,
              pb: 4,
            },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      <MobileBottomNav location={location} navigate={navigate} />
    </Box>
  );
};

export default Layout;
