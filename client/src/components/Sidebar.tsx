import { Box, Typography, Avatar, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/' },
  { label: 'Record Tasks', icon: <EditCalendarRoundedIcon />, path: '/record-tasks' },
  { label: 'Eisenhower', icon: <GridViewRoundedIcon />, path: '/eisenhower' },
  { label: 'Trends', icon: <TrendingUpRoundedIcon />, path: '/trends' },
  { label: 'Categories', icon: <CategoryRoundedIcon />, path: '/categories' },
];

const bottomItems = [
  { label: 'Settings', icon: <SettingsRoundedIcon /> },
  { label: 'Sign out', icon: <LogoutRoundedIcon /> },
];

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export default function Sidebar({ onClose, isMobile }: SidebarProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleNavClick = (path: string) => {
    if (path) {
      navigate(path);
      if (isMobile && onClose) {
        onClose();
      }
    }
  };

  const handleBottomItemClick = (label: string) => {
    if (label === 'Sign out') {
      logout();
      navigate('/login');
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Box
      sx={{
        width: 220,
        minWidth: 220,
        height: '100vh',
        bgcolor: '#161B22',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        py: 2.5,
        animation: 'slideInLeft 0.5s ease forwards',
      }}
    >
      {/* User profile */}
      {user && (
        <Box sx={{ px: 2.5, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#6C9EFF',
              fontSize: '0.95rem',
              fontWeight: 600,
            }}
          >
            {getInitials(user.name)}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{ color: '#E6EDF3', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.3 }}
            >
              {user.name}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{ color: '#8B949E', fontSize: '0.7rem', display: 'block' }}
            >
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Main nav */}
      <List sx={{ px: 1, flex: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={location.pathname === item.path}
            onClick={() => handleNavClick(item.path)}
            sx={{
              borderRadius: '10px',
              mb: 0.3,
              py: 1,
              px: 1.5,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&.Mui-selected': {
                bgcolor: 'rgba(108, 158, 255, 0.12)',
                '& .MuiListItemIcon-root': { color: '#6C9EFF' },
                '& .MuiListItemText-primary': { color: '#E6EDF3', fontWeight: 600 },
              },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.05)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#8B949E', transition: 'color 0.2s ease' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: '#8B949E',
                  transition: 'color 0.2s ease',
                }}>
                  {item.label}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>

      {/* Bottom items */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />
      <List sx={{ px: 1, mt: 0.5 }}>
        {bottomItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => handleBottomItemClick(item.label)}
            sx={{
              borderRadius: '10px',
              mb: 0.3,
              py: 1,
              px: 1.5,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.05)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#8B949E' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: '#8B949E',
                }}>
                  {item.label}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
