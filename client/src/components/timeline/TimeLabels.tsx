import React from 'react';
import { Box, Typography } from '@mui/material';
import { displayTime } from '../../utils/time';

interface TimeLabelsProps {
  useAmPm: boolean;
}

const HOUR_HEIGHT = 60;

export const TimeLabels: React.FC<TimeLabelsProps> = ({ useAmPm }) => {
  return (
    <Box sx={{ width: 80, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', bgcolor: '#161B22', height: '100%' }}>
      <Box sx={{ position: 'relative', top: 12, height: 24 * HOUR_HEIGHT }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <Typography
            key={i}
            sx={{
              position: 'absolute',
              top: i * HOUR_HEIGHT - 9,
              right: 12,
              fontSize: '0.75rem',
              color: '#8B949E',
              fontWeight: 600
            }}
          >
            {displayTime(`${i.toString().padStart(2, '0')}:00`, useAmPm)}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};
