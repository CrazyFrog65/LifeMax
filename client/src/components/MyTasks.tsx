import { Box, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';

export default function MyTasks() {
  const navigate = useNavigate();

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>My tasks</Typography>
      </Box>

      {/* Empty State */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 3 }}>
        <AssignmentTurnedInRoundedIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="body2" sx={{ color: '#8B949E', fontSize: '0.85rem', textAlign: 'center' }}>
          You have no tasks logged for today.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/record-tasks')}
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
          RECORD NEW TASK
        </Button>
      </Box>
    </Paper>
  );
}
