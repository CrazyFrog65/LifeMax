import { Box, Paper, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PieData {
  name: string;
  hours: number;
  color: string;
}

interface WeeklyCategoryPieChartProps {
  data: PieData[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<any> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  
  return (
    <Box
      sx={{
        bgcolor: '#1C2333',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        px: 1.5,
        py: 0.8,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: data.color }} />
      <Typography sx={{ fontSize: '0.75rem', color: '#8B949E' }}>{data.name}</Typography>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#E6EDF3', ml: 1 }}>
        {data.hours}h
      </Typography>
    </Box>
  );
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

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '14px',
        animation: 'fadeIn 0.5s ease forwards',
        animationDelay: '0.5s',
        opacity: 0,
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 2 }}>
        Weekly Categories
      </Typography>

      <Box sx={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="hours"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              stroke="none"
              animationBegin={400}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="middle" 
              align="right" 
              layout="vertical"
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#8B949E' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
