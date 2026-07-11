import { Box, InputBase, IconButton } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

export default function AiHelper() {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1200,
        animation: 'fadeIn 0.6s ease forwards',
        animationDelay: '0.6s',
        opacity: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'rgba(30, 35, 45, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          px: 3,
          py: 1.2,
          width: 380,
          boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(167, 139, 250, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: 'rgba(167, 139, 250, 0.3)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 80px rgba(167, 139, 250, 0.1)',
          },
          '&:focus-within': {
            borderColor: 'rgba(167, 139, 250, 0.4)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 80px rgba(167, 139, 250, 0.15)',
          },
        }}
      >
        <InputBase
          placeholder="How can I help you?"
          fullWidth
          sx={{
            fontSize: '0.9rem',
            color: '#E6EDF3',
            '& input::placeholder': { color: '#8B949E', opacity: 1 },
          }}
        />
        <IconButton
          sx={{
            color: '#A78BFA',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#C4B5FD',
              transform: 'rotate(15deg) scale(1.1)',
            },
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
