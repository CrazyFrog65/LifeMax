import { Box, Paper, Typography } from '@mui/material';

interface CategoryHoursData {
  name: string;
  hours: number;
  color: string;
}

interface WeeklyCategoryPieChartProps {
  data: CategoryHoursData[];
}

export default function WeeklyCategoryPieChart({ data }: WeeklyCategoryPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: '14px',
          height: 270,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'rgba(255,255,255,0.02)',
        }}
      >
        <Typography sx={{ color: '#8B949E', fontSize: '0.9rem' }}>No data for this week</Typography>
      </Paper>
    );
  }

  // Sort categories by hours spent descending, so the most active are at the top
  const sortedData = [...data].sort((a, b) => b.hours - a.hours);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '14px',
        bgcolor: '#161B22',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: 270,
        overflow: 'hidden',
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#E6EDF3' }}>
        Weekly Categories
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, overflowY: 'auto', pr: 0.5, flex: 1 }}>
        {sortedData.map((category) => (
          <Box
            key={category.name}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.2,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                transform: 'translateX(4px)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: category.color || '#8B949E',
                  boxShadow: `0 0 10px ${category.color || '#8B949E'}4D`,
                }}
              />
              <Typography sx={{ color: '#E6EDF3', fontWeight: 600, fontSize: '0.875rem' }}>
                {category.name}
              </Typography>
            </Box>
            <Typography sx={{ color: '#8B949E', fontWeight: 500, fontSize: '0.875rem' }}>
              <span style={{ color: '#6C9EFF', fontWeight: 700 }}>{category.hours.toFixed(1)}</span> h
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
