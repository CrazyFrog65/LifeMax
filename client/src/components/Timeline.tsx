import { Box, Paper, Typography, Button } from '@mui/material';
import { useSettings } from '../contexts/SettingsContext';

const events = [
  { date: 12, title: 'UX workshop', subtitle: '8 of 12 sessions, lead facilitator', time: '14:00–', color: '#6C9EFF' },
  { date: 13, title: 'Interaction design', subtitle: '3 of 6 meetings, team lead', time: '11:00–', color: '#A78BFA' },
  { date: 28, title: 'Team sync', subtitle: '4 of 28 meetings, product team', time: '12:00–', color: '#3FB950' },
  { date: null, title: 'User interview', subtitle: '1 of 2, remote call', time: '16:00–', color: '#D29922' },
  { date: null, title: 'Follow-up interview', subtitle: '2 of 2, remote call', time: '16:00–', color: '#F85149' },
];

export default function Timeline() {
  const { formatTime } = useSettings();
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {events.map((ev, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              py: 1,
              px: 1.5,
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.04)',
                transform: 'translateX(4px)',
              },
            }}
          >
            {/* Date badge */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                bgcolor: `${ev.color}18`,
                border: `1px solid ${ev.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {ev.date && (
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: ev.color }}>
                  {ev.date}
                </Typography>
              )}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.2 }}>
                {ev.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#8B949E', fontSize: '0.72rem' }}>
                {ev.subtitle}
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ color: '#8B949E', fontWeight: 500, fontSize: '0.75rem', flexShrink: 0 }}>
              {formatTime(ev.time)}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            borderColor: 'rgba(255,255,255,0.15)',
            color: '#E6EDF3',
            fontSize: '0.78rem',
            fontWeight: 600,
            py: 0.8,
            '&:hover': {
              borderColor: '#6C9EFF',
              bgcolor: 'rgba(108, 158, 255, 0.08)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          CALENDAR
        </Button>
      </Box>
    </Paper>
  );
}
