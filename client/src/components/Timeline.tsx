import { Box, Paper, Typography } from '@mui/material';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';

export default function Timeline() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '14px',
        animation: 'fadeIn 0.5s ease forwards',
        animationDelay: '0.35s',
        opacity: 0,
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 2 }}>
        Timeline & upcoming
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 4 }}>
        <EventBusyRoundedIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="body2" sx={{ color: '#8B949E', fontSize: '0.85rem', textAlign: 'center' }}>
          No upcoming events scheduled.
        </Typography>
      </Box>
    </Paper>
  );
}
