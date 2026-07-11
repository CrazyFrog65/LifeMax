import { Box, Paper, Typography, Avatar, Chip, Button } from '@mui/material';

const tasks = [
  { user: 'Alex', initials: 'A', color: '#6C9EFF', task: 'Interview: API engineer', due: 'Due' },
  { user: 'Alex', initials: 'A', color: '#6C9EFF', task: 'Reflection session', due: 'Tomorrow' },
  { user: 'LifeMa', initials: 'L', color: '#A78BFA', task: "Today's priorities", due: 'Due' },
];

export default function MyTasks() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '14px',
        animation: 'fadeIn 0.5s ease forwards',
        animationDelay: '0.3s',
        opacity: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>My tasks</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" sx={{ color: '#8B949E', fontSize: '0.82rem' }}>
          3 active tasks
        </Typography>
        <Chip
          label="UPGRADE PLAN"
          size="small"
          sx={{
            bgcolor: '#3FB950',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.65rem',
            height: 24,
            letterSpacing: '0.05em',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: '#2EA043',
              transform: 'scale(1.05)',
            },
          }}
        />
      </Box>

      {/* Task list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2.5 }}>
        {tasks.map((t, idx) => (
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
            <Avatar sx={{ width: 32, height: 32, bgcolor: t.color, fontSize: '0.75rem', fontWeight: 600 }}>
              {t.initials}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <Box component="span" sx={{ color: '#8B949E' }}>{t.user}</Box>
                <Box component="span" sx={{ color: '#8B949E', mx: 0.8 }}>·</Box>
                {t.task}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: t.due === 'Due' ? '#F85149' : '#D29922',
                fontWeight: 500,
                fontSize: '0.75rem',
              }}
            >
              {t.due}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          sx={{
            borderColor: 'rgba(255,255,255,0.15)',
            color: '#E6EDF3',
            fontSize: '0.78rem',
            fontWeight: 600,
            px: 3,
            py: 0.6,
            '&:hover': {
              borderColor: '#6C9EFF',
              bgcolor: 'rgba(108, 158, 255, 0.08)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          TASKS
        </Button>
      </Box>
    </Paper>
  );
}
