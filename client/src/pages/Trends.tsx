import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import axios from '../utils/apiClient';

interface TrendPoint {
  date: string;
  ratio: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: '#1C2333',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          px: 1.5,
          py: 1,
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', color: '#8B949E', mb: 0.5 }}>{label}</Typography>
        {payload.map((entry: any, index: number) => (
          <Typography key={index} sx={{ fontSize: '0.9rem', fontWeight: 600, color: entry.color }}>
            {entry.name}: {entry.value} {entry.name === 'ratio' || entry.name === 'Ratio' ? '%' : 'hrs'}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

// Array of random distinct colors for category breakdown if they don't provide one
const CATEGORY_COLORS = [
  '#6C9EFF', '#3FB950', '#F85149', '#D29922', '#BC8CFF', '#30B0C7', '#F470A7', '#7EE787', '#A371F7'
];

export default function Trends() {
  const [weeklyTrend, setWeeklyTrend] = useState<TrendPoint[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<TrendPoint[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [productiveVsUnproductive, setProductiveVsUnproductive] = useState<any[]>([]);
  const [eisenhowerDistribution, setEisenhowerDistribution] = useState<any[]>([]);
  const [sleepTrend, setSleepTrend] = useState<any[]>([]);
  const [topActivities, setTopActivities] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/analytics/trends');
      if (res.data.success) {
        setWeeklyTrend(res.data.data.weeklyTrend);
        setMonthlyTrend(res.data.data.monthlyTrend);
        setCategoryBreakdown(res.data.data.categoryBreakdown);
        setProductiveVsUnproductive(res.data.data.productiveVsUnproductive);
        setEisenhowerDistribution(res.data.data.eisenhowerDistribution);
        setSleepTrend(res.data.data.sleepTrend);
        setTopActivities(res.data.data.topActivities);

        // Extract unique categories for AreaChart
        const cats = new Set<string>();
        res.data.data.categoryBreakdown.forEach((day: any) => {
          Object.keys(day).forEach(k => {
            if (k !== 'date') cats.add(k);
          });
        });
        setCategoriesList(Array.from(cats));
      }
    } catch (err) {
      console.error('Failed to load trends analytics', err);
    }
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#E6EDF3', fontWeight: 700, mb: 1 }}>
          Productivity Trends
        </Typography>
        <Typography sx={{ color: '#8B949E' }}>
          Track how your habits and effective ratio fluctuate over time.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Weekly Trend (Effective Ratio) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3, borderRadius: 3, bgcolor: '#161B22',
              border: '1px solid rgba(255,255,255,0.06)',
              height: 400, display: 'flex', flexDirection: 'column',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#E6EDF3', fontWeight: 600 }}>7-Day Effective Ratio</Typography>
              <Typography variant="caption" sx={{ color: '#8B949E' }}>Short-term momentum</Typography>
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} domain={[0, 100]} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <Line type="monotone" dataKey="ratio" stroke="#3FB950" strokeWidth={3} dot={{ fill: '#0D1117', stroke: '#3FB950', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#3FB950', stroke: '#0D1117' }} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Monthly Trend (Effective Ratio) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3, borderRadius: 3, bgcolor: '#161B22',
              border: '1px solid rgba(255,255,255,0.06)',
              height: 400, display: 'flex', flexDirection: 'column',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#E6EDF3', fontWeight: 600 }}>30-Day Effective Ratio</Typography>
              <Typography variant="caption" sx={{ color: '#8B949E' }}>Long-term consistency</Typography>
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C9EFF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6C9EFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={20} dy={10} />
                  <YAxis stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} domain={[0, 100]} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <Area type="monotone" dataKey="ratio" stroke="#6C9EFF" strokeWidth={2} fillOpacity={1} fill="url(#colorRatio)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* 1. Category Breakdown Over Time */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3, borderRadius: 3, bgcolor: '#161B22',
              border: '1px solid rgba(255,255,255,0.06)',
              height: 450, display: 'flex', flexDirection: 'column',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#E6EDF3', fontWeight: 600 }}>Category Breakdown (30 Days)</Typography>
              <Typography variant="caption" sx={{ color: '#8B949E' }}>Hours spent per category per day</Typography>
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={categoryBreakdown} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={20} dy={10} />
                  <YAxis stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}h`} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#8B949E' }} />
                  {categoriesList.map((cat, idx) => (
                    <Area
                      key={cat}
                      type="monotone"
                      dataKey={cat}
                      stackId="1"
                      stroke={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
                      fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
                      fillOpacity={0.6}
                      animationDuration={1500}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* 2. Productive vs Unproductive */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3, borderRadius: 3, bgcolor: '#161B22',
              border: '1px solid rgba(255,255,255,0.06)',
              height: 400, display: 'flex', flexDirection: 'column',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#E6EDF3', fontWeight: 600 }}>Productive vs Neutral/Unproductive</Typography>
              <Typography variant="caption" sx={{ color: '#8B949E' }}>Daily hours</Typography>
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productiveVsUnproductive} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={20} dy={10} />
                  <YAxis stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}h`} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="productive" name="Productive" stackId="a" fill="#3FB950" radius={[0, 0, 4, 4]} animationDuration={1500} />
                  <Bar dataKey="unproductive" name="Unproductive/Neutral" stackId="a" fill="#8B949E" radius={[4, 4, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* 3. Eisenhower Quadrant Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3, borderRadius: 3, bgcolor: '#161B22',
              border: '1px solid rgba(255,255,255,0.06)',
              height: 400, display: 'flex', flexDirection: 'column',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#E6EDF3', fontWeight: 600 }}>Eisenhower Matrix Distribution</Typography>
              <Typography variant="caption" sx={{ color: '#8B949E' }}>Daily hours per quadrant</Typography>
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eisenhowerDistribution} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={20} dy={10} />
                  <YAxis stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}h`} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="do" name="Do (Urgent+Important)" stackId="a" fill="#3FB950" animationDuration={1500} />
                  <Bar dataKey="schedule" name="Schedule (Important)" stackId="a" fill="#6C9EFF" animationDuration={1500} />
                  <Bar dataKey="delegate" name="Delegate (Urgent)" stackId="a" fill="#D29922" animationDuration={1500} />
                  <Bar dataKey="eliminate" name="Eliminate (Neither)" stackId="a" fill="#F85149" radius={[4, 4, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* 4. Sleep Trend */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3, borderRadius: 3, bgcolor: '#161B22',
              border: '1px solid rgba(255,255,255,0.06)',
              height: 400, display: 'flex', flexDirection: 'column',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#E6EDF3', fontWeight: 600 }}>Sleep Quality (30 Days)</Typography>
              <Typography variant="caption" sx={{ color: '#8B949E' }}>Track how your sleep hours fluctuate</Typography>
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={20} dy={10} />
                  <YAxis stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}h`} dx={-10} domain={[0, 12]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <Line type="stepAfter" dataKey="hours" name="Sleep" stroke="#A371F7" strokeWidth={3} dot={{ fill: '#0D1117', stroke: '#A371F7', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#A371F7', stroke: '#0D1117' }} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* 5. Top Activities */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3, borderRadius: 3, bgcolor: '#161B22',
              border: '1px solid rgba(255,255,255,0.06)',
              height: 400, display: 'flex', flexDirection: 'column',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#E6EDF3', fontWeight: 600 }}>Top 10 Activities</Typography>
              <Typography variant="caption" sx={{ color: '#8B949E' }}>Total hours spent over the last 30 days</Typography>
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topActivities} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}h`} />
                  <YAxis dataKey="name" type="category" stroke="#8B949E" tick={{ fill: '#E6EDF3', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="hours" name="Total Time" fill="#30B0C7" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
