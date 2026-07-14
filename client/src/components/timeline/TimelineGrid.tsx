import React from 'react';
import { Box } from '@mui/material';

const HOUR_HEIGHT = 60;

export const TimelineGrid: React.FC = () => {
  return (
    <>
      {Array.from({ length: 24 }).map((_, i) => (
        <Box key={i} sx={{ position: 'absolute', top: i * HOUR_HEIGHT, left: 0, right: 0, height: HOUR_HEIGHT, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, borderBottom: '1px dashed rgba(255,255,255,0.015)' }} />
        </Box>
      ))}
    </>
  );
};
