import {
  Box,
  InputBase,
  Avatar,
  IconButton,
  Badge,
  Typography,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function TopBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { useAmPm, setUseAmPm } = useSettings();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3.5,
        py: 1.5,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        animation: 'fadeIn 0.4s ease forwards',
      }}
    >
      {/* Search */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'rgba(255,255,255,0.04)',
          borderRadius: '10px',
          px: 2,
          py: 0.8,
          width: 340,
          border: '1px solid rgba(255,255,255,0.06)',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.06)',
            borderColor: 'rgba(255,255,255,0.1)',
          },
          '&:focus-within': {
            borderColor: '#6C9EFF',
            bgcolor: 'rgba(108, 158, 255, 0.05)',
            boxShadow: '0 0 0 3px rgba(108, 158, 255, 0.1)',
          },
        }}
      >
        <InputBase
          placeholder="Search tasks, goals, or habits"
          sx={{
            flex: 1,
            fontSize: '0.85rem',
            color: '#E6EDF3',
            '& input::placeholder': { color: '#8B949E', opacity: 1 },
          }}
        />
        <SearchRoundedIcon sx={{ color: '#8B949E', fontSize: 20 }} />
      </Box>

      {/* Right side */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          sx={{
            color: '#8B949E',
            transition: 'all 0.2s ease',
            '&:hover': { color: '#E6EDF3', bgcolor: 'rgba(255,255,255,0.06)' },
          }}
        >
          <Badge variant="dot" color="primary">
            <NotificationsNoneRoundedIcon sx={{ fontSize: 22 }} />
          </Badge>
        </IconButton>
        <IconButton
          sx={{
            color: '#8B949E',
            transition: 'all 0.2s ease',
            '&:hover': { color: '#E6EDF3', bgcolor: 'rgba(255,255,255,0.06)' },
          }}
        >
          <Badge variant="dot" color="success">
            <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 22 }} />
          </Badge>
        </IconButton>

        <Box
          onClick={handleOpenMenu}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            ml: 1,
            cursor: 'pointer',
            py: 0.5,
            px: 1,
            borderRadius: '10px',
            transition: 'all 0.2s ease',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
          }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#6C9EFF', fontSize: '0.8rem', fontWeight: 600 }}>
            A
          </Avatar>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#E6EDF3' }}>
            Alex
          </Typography>
          <KeyboardArrowDownRoundedIcon sx={{ color: '#8B949E', fontSize: 18 }} />
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          slotProps={{
            paper: {
              sx: {
                bgcolor: '#161B22',
                color: '#E6EDF3',
                border: '1px solid rgba(255,255,255,0.1)',
                mt: 1,
              }
            }
          }}
        >
          <MenuItem sx={{ py: 1, px: 2, '&:hover': { bgcolor: 'transparent' } }}>
            <FormControlLabel
              control={
                <Switch
                  checked={useAmPm}
                  onChange={(e) => setUseAmPm(e.target.checked)}
                  size="small"
                  color="primary"
                />
              }
              label={<Typography sx={{ fontSize: '0.9rem' }}>Use 12-hour (AM/PM)</Typography>}
            />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
