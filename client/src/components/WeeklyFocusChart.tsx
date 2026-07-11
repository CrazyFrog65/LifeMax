import { Box, Paper, Typography, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface BarData {
  day: string;
  hours: number;
}

interface WeeklyFocusChartProps {
  data: BarData[];
  todayIndex: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: '#1C2333',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        px: 1.5,
        py: 0.8,
      }}
    >
      <Typography sx={{ fontSize: '0.75rem', color: '#8B949E' }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#E6EDF3' }}>
        {payload[0].value}h
      </Typography>
    </Box>
  );
}

export default function WeeklyFocusChart({ data, todayIndex }: WeeklyFocusChartProps) {
  // Determine max domain to scale Y axis appropriately (min 8)
  const maxHours = Math.max(8, ...data.map(d => d.hours));
  const domainMax = Math.ceil(maxHours / 2) * 2; // round up to nearest even number

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '14px',
        animation: 'fadeIn 0.5s ease forwards',
        animationDelay: '0.4s',
        opacity: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
          Weekly focus hours
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Chip
            label="EXPORT"
            size="small"
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.12)',
              color: '#8B949E',
              fontWeight: 600,
              fontSize: '0.6rem',
              height: 24,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#6C9EFF',
                color: '#6C9EFF',
              },
            }}
          />
          <Chip
            label="SHARE"
            size="small"
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.12)',
              color: '#8B949E',
              fontWeight: 600,
              fontSize: '0.6rem',
              height: 24,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#A78BFA',
                color: '#A78BFA',
              },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ width: '100%', height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8B949E', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8B949E', fontSize: 11 }}
              tickFormatter={(v: number) => `${v}h`}
              domain={[0, domainMax]}
              tickCount={5}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Bar
              dataKey="hours"
              radius={[6, 6, 2, 2]}
              animationBegin={300}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {data.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={idx <= todayIndex ? '#8B949E' : 'rgba(255,255,255,0.08)'}
                  style={{
                    transition: 'fill 0.3s ease',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
