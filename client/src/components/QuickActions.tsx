import { Box, Paper, Typography } from '@mui/material';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        animation: 'fadeIn 0.5s ease forwards',
        animationDelay: '0.2s',
        opacity: 0,
      }}
    >
      {/* Record Task */}
      <Paper
        onClick={() => navigate('/record-tasks')}
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 30px rgba(63, 185, 80, 0.12)',
            bgcolor: 'rgba(63, 185, 80, 0.05)',
          },
        }}
      >
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(63, 185, 80, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <AddCircleOutlineRoundedIcon sx={{ color: '#3FB950', fontSize: 22 }} />
        </Box>
        <Typography variant="caption" sx={{ color: '#8B949E', fontSize: '0.7rem', textAlign: 'center' }}>
          Record Task
        </Typography>
      </Paper>

      {/* Eisenhower Matrix */}
      <Paper
        onClick={() => navigate('/eisenhower')}
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 30px rgba(108, 158, 255, 0.12)',
            bgcolor: 'rgba(108, 158, 255, 0.05)',
          },
        }}
      >
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(108, 158, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <GridViewRoundedIcon sx={{ color: '#6C9EFF', fontSize: 22 }} />
        </Box>
        <Typography variant="caption" sx={{ color: '#8B949E', fontSize: '0.7rem', textAlign: 'center' }}>
          Prioritize
        </Typography>
      </Paper>

      {/* Trends */}
      <Paper
        onClick={() => navigate('/trends')}
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 30px rgba(167, 139, 250, 0.12)',
            bgcolor: 'rgba(167, 139, 250, 0.05)',
          },
        }}
      >
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(167, 139, 250, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <TrendingUpRoundedIcon sx={{ color: '#A78BFA', fontSize: 22 }} />
        </Box>
        <Typography variant="caption" sx={{ color: '#8B949E', fontSize: '0.7rem', textAlign: 'center' }}>
          View Trends
        </Typography>
      </Paper>
    </Box>
  );
}
