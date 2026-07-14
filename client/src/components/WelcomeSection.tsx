import { Box, Typography, Button } from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useAuth } from '../contexts/AuthContext';

export default function WelcomeSection() {
  const { user } = useAuth();
  
  return (
    <Box
      sx={{
        animation: 'fadeIn 0.5s ease forwards',
        animationDelay: '0.1s',
        opacity: 0,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.4rem' }}>
        Welcome back, {user?.name || 'User'}
      </Typography>
      <Typography variant="body2" sx={{ color: '#8B949E', mb: 2.5 }}>
        Here is your LifeMax dashboard. Let's make today productive!
      </Typography>

      <Button
        variant="outlined"
        startIcon={<SettingsRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          borderColor: 'rgba(255,255,255,0.15)',
          color: '#E6EDF3',
          fontSize: '0.8rem',
          fontWeight: 600,
          px: 2.5,
          py: 0.8,
          mb: 2.5,
          '&:hover': {
            borderColor: '#6C9EFF',
            bgcolor: 'rgba(108, 158, 255, 0.08)',
            transform: 'translateY(-1px)',
          },
        }}
      >
        SETTINGS
      </Button>
    </Box>
  );
}
