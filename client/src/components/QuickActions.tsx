import { Box, Paper, Typography } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

export default function QuickActions() {
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
      {/* Today's progress - circular gauge */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 100,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 30px rgba(63, 185, 80, 0.12)',
          },
        }}
      >
        {/* Circular progress */}
        <Box
          sx={{
            position: 'relative',
            width: 60,
            height: 60,
            mb: 1,
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <circle
              cx="30"
              cy="30"
              r="25"
              fill="none"
              stroke="#3FB950"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 25 * 0.76} ${2 * Math.PI * 25 * (1 - 0.76)}`}
              style={{
                transition: 'stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </svg>
          <Typography
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#3FB950',
            }}
          >
            76%
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#8B949E', fontSize: '0.7rem', textAlign: 'center' }}>
          Today's
          <br />
          progress
        </Typography>
      </Paper>

      {/* Reflection prompts */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 100,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 30px rgba(108, 158, 255, 0.12)',
          },
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            bgcolor: 'rgba(108, 158, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <EditRoundedIcon sx={{ color: '#6C9EFF', fontSize: 22 }} />
        </Box>
        <Typography variant="caption" sx={{ color: '#8B949E', fontSize: '0.7rem', textAlign: 'center' }}>
          Reflection
          <br />
          prompts
        </Typography>
      </Paper>

      {/* FAQ */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 100,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 30px rgba(167, 139, 250, 0.12)',
          },
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            bgcolor: 'rgba(167, 139, 250, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <CalendarTodayRoundedIcon sx={{ color: '#A78BFA', fontSize: 22 }} />
        </Box>
        <Typography variant="caption" sx={{ color: '#8B949E', fontSize: '0.7rem', textAlign: 'center' }}>
          FAQ
        </Typography>
      </Paper>
    </Box>
  );
}
