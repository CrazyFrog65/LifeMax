import { Box, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MiniCalendar() {
  const today = dayjs();
  const startOfWeek = today.startOf('week'); // Sunday

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = startOfWeek.add(i, 'day');
    return {
      day: days[i],
      date: d.date(),
      isToday: d.isSame(today, 'day'),
    };
  });

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '14px',
        animation: 'fadeIn 0.5s ease forwards',
        animationDelay: '0.25s',
        opacity: 0,
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 2 }}>
        {today.format('MMMM YYYY')}
      </Typography>

      {/* Week row */}
      <Box sx={{ display: 'flex', gap: 0 }}>
        {weekDates.map((wd) => (
          <Box
            key={wd.day}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              py: 1,
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              bgcolor: wd.isToday ? 'rgba(108, 158, 255, 0.15)' : 'transparent',
              border: wd.isToday ? '1px solid rgba(108, 158, 255, 0.3)' : '1px solid transparent',
              '&:hover': {
                bgcolor: wd.isToday ? 'rgba(108, 158, 255, 0.2)' : 'rgba(255,255,255,0.04)',
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: wd.isToday ? '#6C9EFF' : '#8B949E',
                fontWeight: 500,
                fontSize: '0.7rem',
              }}
            >
              {wd.day}
            </Typography>
            <Typography
              sx={{
                fontWeight: wd.isToday ? 700 : 500,
                fontSize: '0.9rem',
                color: wd.isToday ? '#6C9EFF' : '#E6EDF3',
              }}
            >
              {wd.date}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
