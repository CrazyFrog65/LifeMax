import { Box, Typography, Button, Paper, AvatarGroup, Avatar, Chip } from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

export default function WelcomeSection() {
  return (
    <Box
      sx={{
        animation: 'fadeIn 0.5s ease forwards',
        animationDelay: '0.1s',
        opacity: 0,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.4rem' }}>
        Welcome back, Alex
      </Typography>
      <Typography variant="body2" sx={{ color: '#8B949E', mb: 2.5 }}>
        Open the panel to view your progress.
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

      {/* Sprint cards */}
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Paper
          elevation={0}
          sx={{
            px: 2.5,
            py: 1.8,
            borderRadius: '12px',
            bgcolor: 'rgba(108, 158, 255, 0.08)',
            border: '1px solid rgba(108, 158, 255, 0.15)',
            flex: 1,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: 'rgba(108, 158, 255, 0.12)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(108, 158, 255, 0.1)',
            },
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 0.3 }}>Next review</Typography>
          <Typography variant="caption" sx={{ color: '#8B949E', display: 'block', mb: 1 }}>
            Week 12
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AvatarGroup
              max={3}
              sx={{
                '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.65rem', border: '2px solid #161B22' },
              }}
            >
              <Avatar sx={{ bgcolor: '#F85149' }}>J</Avatar>
              <Avatar sx={{ bgcolor: '#A78BFA' }}>M</Avatar>
              <Avatar sx={{ bgcolor: '#3FB950' }}>K</Avatar>
            </AvatarGroup>
            <Typography variant="caption" sx={{ color: '#8B949E' }}>Design team</Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            px: 2.5,
            py: 1.8,
            borderRadius: '12px',
            bgcolor: 'rgba(167, 139, 250, 0.08)',
            border: '1px solid rgba(167, 139, 250, 0.15)',
            flex: 1,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: 'rgba(167, 139, 250, 0.12)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(167, 139, 250, 0.1)',
            },
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 0.3 }}>Next sprint</Typography>
          <Typography variant="caption" sx={{ color: '#8B949E', display: 'block', mb: 1 }}>
            Week 12
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AvatarGroup
              max={3}
              sx={{
                '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.65rem', border: '2px solid #161B22' },
              }}
            >
              <Avatar sx={{ bgcolor: '#D29922' }}>L</Avatar>
              <Avatar sx={{ bgcolor: '#58A6FF' }}>R</Avatar>
            </AvatarGroup>
            <Typography variant="caption" sx={{ color: '#8B949E' }}>Product</Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
