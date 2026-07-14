import React from 'react';
import { Box } from '@mui/material';
import dayjs from 'dayjs';

interface CurrentTimeIndicatorProps {
  date: string;
  currentTimeMins: number;
}

export const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ date, currentTimeMins }) => {
  if (dayjs().format('YYYY-MM-DD') !== date) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: currentTimeMins,
        left: 0,
        right: 0,
        height: 2,
        bgcolor: '#F85149',
        zIndex: 20,
        pointerEvents: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: -4,
          top: -4,
          width: 10,
          height: 10,
          bgcolor: '#F85149',
          borderRadius: '50%'
        }
      }}
    />
  );
};
