import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from '../utils/apiClient';
import WelcomeSection from './WelcomeSection';
import QuickActions from './QuickActions';
import MyTasks from './MyTasks';
import MiniCalendar from './MiniCalendar';
import Timeline from './Timeline';
import WeeklyFocusChart from './WeeklyFocusChart';
import WeeklyCategoryPieChart from './WeeklyCategoryPieChart';
import AiHelper from './AiHelper';

export default function Dashboard() {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [todayIndex, setTodayIndex] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/analytics/weekly');
      if (res.data.success) {
        setBarData(res.data.data.barChart);
        setPieData(res.data.data.pieChart);
        
        // Find index of today in barChart (last item is today if sorted chronologically, but our backend builds past 7 days up to today, so today is index 6)
        setTodayIndex(6);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 3,
          maxWidth: 1200,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <WelcomeSection />
          <MyTasks />
          <WeeklyFocusChart data={barData} todayIndex={todayIndex} />
          <WeeklyCategoryPieChart data={pieData} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <QuickActions />
          <MiniCalendar />
          <Timeline />
        </Box>
      </Box>
      <AiHelper />
    </>
  );
}
