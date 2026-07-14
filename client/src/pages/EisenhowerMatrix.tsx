import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import axios from '../utils/apiClient';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  isUrgent: boolean;
  isImportant: boolean;
  activity: {
    name: string;
    category: Category;
  };
}

export default function EisenhowerMatrix() {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    fetchDayLog();
  }, [date]);

  const fetchDayLog = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/day-logs/${date}`);
      if (res.data.success && res.data.data) {
        setBlocks(res.data.data.timeBlocks);
      } else {
        setBlocks([]);
      }
    } catch (err) {
      console.error('Failed to load day log', err);
    }
  };

  // Group blocks by Eisenhower matrix quadrants
  // Q1: Urgent & Important (Do First)
  // Q2: Not Urgent & Important (Schedule)
  // Q3: Urgent & Not Important (Delegate)
  // Q4: Not Urgent & Not Important (Eliminate)
  const quadrants = useMemo(() => {
    return {
      q1: blocks.filter((b) => b.isUrgent && b.isImportant),
      q2: blocks.filter((b) => !b.isUrgent && b.isImportant),
      q3: blocks.filter((b) => b.isUrgent && !b.isImportant),
      q4: blocks.filter((b) => !b.isUrgent && !b.isImportant),
    };
  }, [blocks]);

  const stats = useMemo(() => {
    const totalMins = blocks.reduce((acc, b) => acc + b.durationMinutes, 0);
    const getMins = (q: TimeBlock[]) => q.reduce((acc, b) => acc + b.durationMinutes, 0);
    
    const q1Mins = getMins(quadrants.q1);
    const q2Mins = getMins(quadrants.q2);
    const q3Mins = getMins(quadrants.q3);
    const q4Mins = getMins(quadrants.q4);

    const calcPct = (mins: number) => totalMins === 0 ? 0 : Math.round((mins / totalMins) * 100);

    return {
      totalMins,
      q1: calcPct(q1Mins),
      q2: calcPct(q2Mins),
      q3: calcPct(q3Mins),
      q4: calcPct(q4Mins),
      urgentYes: calcPct(q1Mins + q3Mins),
      urgentNo: calcPct(q2Mins + q4Mins),
      importantYes: calcPct(q1Mins + q2Mins),
      importantNo: calcPct(q3Mins + q4Mins),
    };
  }, [blocks, quadrants]);


  const Quadrant = ({ title, color, subtitle, blocksList, percent }: { title: string, color: string, subtitle: string, blocksList: TimeBlock[], percent: number }) => (
    <Paper
      sx={{
        flex: 1,
        bgcolor: 'rgba(22, 27, 34, 0.6)',
        border: `1px solid ${color}40`,
        borderRadius: 3,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 250,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: color,
        }}
      />
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <Box>
          <Typography variant="h6" sx={{ color: '#E6EDF3', fontWeight: 600 }}>{title}</Typography>
          <Typography variant="caption" sx={{ color: color }}>{subtitle}</Typography>
        </Box>
        <Chip
          label={blocksList.length.toString()}
          size="small"
          sx={{ bgcolor: `${color}20`, color: color, fontWeight: 700 }}
        />
      </Box>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <Typography sx={{ fontSize: '5rem', fontWeight: 800, color: color, lineHeight: 1 }}>
          {percent}%
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ color: '#E6EDF3', fontWeight: 700, mb: 1 }}>
                Eisenhower Matrix
              </Typography>
              <Typography sx={{ color: '#8B949E' }}>
                Prioritize your logged tasks by urgency and importance.
              </Typography>
            </Box>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                open={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                onOpen={() => setIsDatePickerOpen(true)}
                value={dayjs(date)}
                onChange={(newValue) => {
                  if (newValue) {
                    setDate(newValue.format('YYYY-MM-DD'));
                  }
                }}
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    onClick: () => setIsDatePickerOpen(true),
                    sx: {
                      bgcolor: '#161B22',
                      borderRadius: 2,
                      minWidth: 160,
                      input: { color: '#E6EDF3', py: 1.2, px: 2, fontSize: '1.05rem', fontWeight: 500, cursor: 'pointer' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#6C9EFF' },
                      },
                      '& .MuiSvgIcon-root': { color: '#8B949E' },
                    }
                  },
                  popper: {
                    sx: {
                      '& .MuiPaper-root': {
                        bgcolor: '#161B22',
                        color: '#E6EDF3',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backgroundImage: 'none',
                      },
                      '& .MuiPickersDay-root': {
                        color: '#E6EDF3',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                        '&.Mui-selected': { bgcolor: '#6C9EFF', color: '#000', fontWeight: 600 },
                        '&.Mui-selected:hover': { bgcolor: '#58A6FF' },
                      },
                      '& .MuiPickersCalendarHeader-root': {
                        color: '#E6EDF3',
                      },
                      '& .MuiDayCalendar-weekDayLabel': {
                        color: '#8B949E',
                      },
                      '& .MuiIconButton-root': {
                        color: '#8B949E',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                      },
                      '& .MuiPickersYear-yearButton': {
                        color: '#E6EDF3',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                        '&.Mui-selected': { bgcolor: '#6C9EFF', color: '#000' },
                      },
                      '& .MuiPickersMonth-monthButton': {
                        color: '#E6EDF3',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                        '&.Mui-selected': { bgcolor: '#6C9EFF', color: '#000' },
                      }
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr', gridTemplateRows: '30px 1fr 1fr', gap: 3, minHeight: 600 }}>
            {/* Headers */}
            <Box /> {/* Top-left empty corner */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography sx={{ color: '#8B949E', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                Urgent
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography sx={{ color: '#8B949E', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                Not Urgent
              </Typography>
            </Box>

            {/* Left labels */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              <Typography sx={{ color: '#8B949E', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                Important
              </Typography>
            </Box>

            {/* Q1: Urgent + Important */}
            <Quadrant title="Do First" color="#F85149" subtitle="Urgent & Important" blocksList={quadrants.q1} percent={stats.q1} />
            
            {/* Q2: Not Urgent + Important */}
            <Quadrant title="Schedule" color="#6C9EFF" subtitle="Not Urgent & Important" blocksList={quadrants.q2} percent={stats.q2} />

            {/* Left label bottom */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              <Typography sx={{ color: '#8B949E', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                Not Important
              </Typography>
            </Box>

            {/* Q3: Urgent + Not Important */}
            <Quadrant title="Delegate" color="#D29922" subtitle="Urgent & Not Important" blocksList={quadrants.q3} percent={stats.q3} />
            
            {/* Q4: Not Urgent + Not Important */}
            <Quadrant title="Eliminate" color="#8B949E" subtitle="Not Urgent & Not Important" blocksList={quadrants.q4} percent={stats.q4} />
          </Box>

          {/* Tasks Distribution Table */}
          <Box sx={{ mt: 6, mb: 4, maxWidth: 600 }}>
            <Typography variant="h6" sx={{ color: '#E6EDF3', fontWeight: 600, mb: 3 }}>
              Tasks Distribution
            </Typography>

            <Paper sx={{ bgcolor: 'rgba(22, 27, 34, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '150px 100px 1fr', alignItems: 'center', p: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography sx={{ color: '#8B949E', fontWeight: 600 }}>Urgent</Typography>
                <Box>
                  <Typography sx={{ color: '#E6EDF3', mb: 1 }}>Yes</Typography>
                  <Typography sx={{ color: '#E6EDF3' }}>No</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ color: '#F85149', fontWeight: 700, mb: 1 }}>{stats.urgentYes}%</Typography>
                  <Typography sx={{ color: '#8B949E', fontWeight: 700 }}>{stats.urgentNo}%</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '150px 100px 1fr', alignItems: 'center', p: 2 }}>
                <Typography sx={{ color: '#8B949E', fontWeight: 600 }}>Important</Typography>
                <Box>
                  <Typography sx={{ color: '#E6EDF3', mb: 1 }}>Yes</Typography>
                  <Typography sx={{ color: '#E6EDF3' }}>No</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ color: '#6C9EFF', fontWeight: 700, mb: 1 }}>{stats.importantYes}%</Typography>
                  <Typography sx={{ color: '#8B949E', fontWeight: 700 }}>{stats.importantNo}%</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
    </>
  );
}
