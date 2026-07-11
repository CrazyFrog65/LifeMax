import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Typography, Paper, Button, TextField, MenuItem, Select,
  FormControl, IconButton, Chip, Switch, FormControlLabel,
  Snackbar, Alert, Popover, Tooltip
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import ContentCutRoundedIcon from '@mui/icons-material/ContentCutRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import axios from '../utils/apiClient';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSettings } from '../contexts/SettingsContext';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  productive?: boolean;
  defaultUrgent?: boolean;
  defaultImportant?: boolean;
}

interface TimeBlock {
  id: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  activityName: string;
  categoryId: string;
  isUrgent: boolean;
  isImportant: boolean;
}

const HOUR_HEIGHT = 60; // pixels per hour
const TOTAL_HEIGHT = 24 * HOUR_HEIGHT;

const toMins = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const toTimeStr = (mins: number) => {
  let h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  if (h >= 24) h %= 24;
  if (h < 0) h = 24 + (h % 24);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export default function RecordTasks() {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [categories, setCategories] = useState<Category[]>([]);
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [history, setHistory] = useState<TimeBlock[][]>([]);
  const [effectiveRatio, setEffectiveRatio] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Current time for red line indicator
  const [currentTimeMins, setCurrentTimeMins] = useState(() => {
    const now = dayjs();
    return now.hour() * 60 + now.minute();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs();
      setCurrentTimeMins(now.hour() * 60 + now.minute());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Popover state
  const [editBlockId, setEditBlockId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { useAmPm } = useSettings();
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<Category[]>([]);

  useEffect(() => {
    categoriesRef.current = categories;
  }, [categories]);

  // Auto-scroll to 6 AM on load
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 5 * HOUR_HEIGHT; // scroll to 5 AM so 6 AM is visible
    }
  }, []);

  // Keyboard Undo
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [history]);

  const pushHistory = useCallback((currentBlocks: TimeBlock[]) => {
    setHistory(prev => [...prev, currentBlocks].slice(-30));
  }, []);

  const handleUndo = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const previousState = newHistory.pop();
      if (previousState) setBlocks(previousState);
      return newHistory;
    });
    setAnchorEl(null);
  }, []);

  const generateDefaultBlocks = () => {
    if (categories.length === 0) return [];
    const sleepCat = categories.find(c => c.name.toLowerCase() === 'sleep')?.id || categories[0].id;
    const defaultCat = categories.find(c => c.name.toLowerCase() === 'none')?.id || categories[0].id;

    const defaultBlocks: TimeBlock[] = [];
    
    defaultBlocks.push({
      id: Math.random().toString(),
      startTime: '00:00',
      endTime: '06:00',
      activityName: 'Sleep',
      categoryId: sleepCat,
      isUrgent: false,
      isImportant: true,
    });
    
    for (let i = 6; i < 22; i++) {
      defaultBlocks.push({
        id: Math.random().toString(),
        startTime: `${i.toString().padStart(2, '0')}:00`,
        endTime: `${(i + 1).toString().padStart(2, '0')}:00`,
        activityName: '',
        categoryId: defaultCat,
        isUrgent: false,
        isImportant: false,
      });
    }
    
    defaultBlocks.push({
      id: Math.random().toString(),
      startTime: '22:00',
      endTime: '00:00',
      activityName: 'Sleep',
      categoryId: sleepCat,
      isUrgent: false,
      isImportant: true,
    });
    
    return defaultBlocks;
  };

  const fetchDayLog = async () => {
    if (categories.length === 0) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/day-logs/${date}`);
      if (res.data.success && res.data.data) {
        const dbBlocks: TimeBlock[] = [];
        res.data.data.timeBlocks.forEach((b: any) => {
          const s = dayjs(b.startTime).format('HH:mm');
          const e = dayjs(b.endTime).format('HH:mm');
          
          if (toMins(s) > toMins(e) && e !== '00:00') {
            dbBlocks.push({
              id: Math.random().toString(),
              startTime: s,
              endTime: '00:00',
              activityName: b.activity.name,
              categoryId: b.activity.categoryId,
              isUrgent: b.isUrgent,
              isImportant: b.isImportant,
            });
            dbBlocks.push({
              id: Math.random().toString(),
              startTime: '00:00',
              endTime: e,
              activityName: b.activity.name,
              categoryId: b.activity.categoryId,
              isUrgent: b.isUrgent,
              isImportant: b.isImportant,
            });
          } else {
            dbBlocks.push({
              id: Math.random().toString(),
              startTime: s,
              endTime: e,
              activityName: b.activity.name,
              categoryId: b.activity.categoryId,
              isUrgent: b.isUrgent,
              isImportant: b.isImportant,
            });
          }
        });
        
        dbBlocks.sort((a, b) => toMins(a.startTime) - toMins(b.startTime));
        
        // Safety net to heal overlapping or gap blocks from glitches
        const repairedBlocks: TimeBlock[] = [];
        let currentMins = 0;
        
        for (const block of dbBlocks) {
          const startMins = toMins(block.startTime);
          if (startMins > currentMins) {
            repairedBlocks.push({
              id: Math.random().toString(),
              startTime: toTimeStr(currentMins),
              endTime: block.startTime,
              activityName: 'None',
              categoryId: categories[0]?.id || '',
              isUrgent: false,
              isImportant: false,
            });
          }
          if (startMins >= currentMins) { 
             repairedBlocks.push(block);
             currentMins = block.endTime === '00:00' ? 1440 : toMins(block.endTime);
          }
        }
        
        if (currentMins < 1440) {
          repairedBlocks.push({
            id: Math.random().toString(),
            startTime: toTimeStr(currentMins),
            endTime: '00:00',
            activityName: 'None',
            categoryId: categories[0]?.id || '',
            isUrgent: false,
            isImportant: false,
          });
        }
        
        setBlocks(repairedBlocks);
        setHistory([]);
      } else {
        setBlocks(generateDefaultBlocks());
        setHistory([]);
      }
    } catch (err) {
      console.error('Failed to load day log', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      if (res.data.success) setCategories(res.data.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchDayLog(); }, [date, categories]);

  useEffect(() => {
    if (blocks.length === 0 || categories.length === 0) {
      setEffectiveRatio(0);
      return;
    }
    let totalMinutes = 0;
    let nsMinutes = 0;
    const nsCat = categories.find((c) => c.name.toLowerCase() === 'nothing specific' || c.name.toLowerCase() === 'none');

    blocks.forEach((b) => {
      let dur = toMins(b.endTime) - toMins(b.startTime);
      if (dur <= 0 && b.endTime === '00:00') dur += 24 * 60;
      if (dur < 0) dur += 24 * 60;
      totalMinutes += dur;
      if (nsCat && b.categoryId === nsCat.id) nsMinutes += dur;
    });

    const ratio = totalMinutes > 0 ? (totalMinutes - nsMinutes) / totalMinutes : 0;
    setEffectiveRatio(ratio);
  }, [blocks, categories]);

  const moveBlockBoundaries = useCallback((id: string, mode: 'top' | 'bottom' | 'body', newStartMins: number, newEndMins: number) => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      if (index === -1) return prev;
      
      const newBlocks = [...prev];
      const target = newBlocks[index];
      
      const formatTime = (m: number) => m === 1440 ? '00:00' : toTimeStr(m);
      
      newBlocks[index] = { ...target, startTime: formatTime(newStartMins), endTime: formatTime(newEndMins) };
      
      if (mode === 'top' || mode === 'body') {
        if (index > 0) newBlocks[index - 1] = { ...newBlocks[index - 1], endTime: formatTime(newStartMins) };
      }
      if (mode === 'bottom' || mode === 'body') {
        if (index < newBlocks.length - 1) newBlocks[index + 1] = { ...newBlocks[index + 1], startTime: formatTime(newEndMins) };
      }
      
      return newBlocks;
    });
  }, []);

  const updateBlock = useCallback((id: string, field: keyof TimeBlock, value: any) => {
    setBlocks(prev => {
      const blockIndex = prev.findIndex(b => b.id === id);
      if (blockIndex === -1) return prev;
      
      const newBlocks = prev.map(b => ({ ...b }));
      newBlocks[blockIndex] = { ...newBlocks[blockIndex], [field]: value };
      
      if (field === 'categoryId') {
        const cat = categoriesRef.current.find(c => c.id === value);
        if (cat) {
          newBlocks[blockIndex].isUrgent = cat.defaultUrgent || false;
          newBlocks[blockIndex].isImportant = cat.defaultImportant || false;
        }
      }
      return newBlocks;
    });
  }, []);

  const handleDragStart = (e: React.PointerEvent, block: TimeBlock, mode: 'top' | 'bottom' | 'body') => {
    e.preventDefault();
    e.stopPropagation();
    
    setAnchorEl(null);
    setEditBlockId(null);
    
    const index = blocks.findIndex(b => b.id === block.id);
    if (index === -1 || blocks.length <= 1) return;

    const prevBlock = index === 0 ? null : blocks[index - 1];
    const nextBlock = index === blocks.length - 1 ? null : blocks[index + 1];

    const getMins = (time: string, isEnd: boolean) => {
      const m = toMins(time);
      if (isEnd && m === 0) return 1440;
      return m;
    };
    
    const prevDur = prevBlock ? getMins(prevBlock.endTime, true) - getMins(prevBlock.startTime, false) : 0;
    const targetDur = getMins(block.endTime, true) - getMins(block.startTime, false);
    const nextDur = nextBlock ? getMins(nextBlock.endTime, true) - getMins(nextBlock.startTime, false) : 0;

    let minDelta = 0;
    let maxDelta = 0;

    if (mode === 'top') {
      minDelta = prevBlock ? -(prevDur - 15) : 0;
      maxDelta = targetDur - 15;
    } else if (mode === 'bottom') {
      minDelta = -(targetDur - 15);
      maxDelta = nextBlock ? nextDur - 15 : 0;
    } else if (mode === 'body') {
      minDelta = prevBlock ? -(prevDur - 15) : 0;
      maxDelta = nextBlock ? nextDur - 15 : 0;
    }

    const startY = e.clientY;
    const initialStartMins = getMins(block.startTime, false);
    const initialEndMins = getMins(block.endTime, true);
    
    let isDragging = false;

    const onMove = (moveEvent: PointerEvent) => {
      let deltaY = moveEvent.clientY - startY;
      
      if (!isDragging && Math.abs(deltaY) > 3) {
        isDragging = true;
        pushHistory(blocks);
      }
      
      if (isDragging) {
        let deltaMins = Math.round(deltaY / 15) * 15;
        deltaMins = Math.max(minDelta, Math.min(maxDelta, deltaMins));
        
        let newStartMins = initialStartMins;
        let newEndMins = initialEndMins;
        
        if (mode === 'top') newStartMins += deltaMins;
        if (mode === 'bottom') newEndMins += deltaMins;
        if (mode === 'body') {
          newStartMins += deltaMins;
          newEndMins += deltaMins;
        }

        moveBlockBoundaries(block.id, mode, newStartMins, newEndMins);
      }
    };
    
    const onUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      
      if (!isDragging && mode === 'body') {
        const el = document.getElementById(`block-${block.id}`);
        if (el) {
          setEditBlockId(block.id);
          setAnchorEl(el);
        }
      }
    };
    
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const handleTimelineDoubleClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const mins = Math.round(y / 15) * 15;
    const timeStr = toTimeStr(mins);
    if (mins === 0 || mins === 1440) return; // don't split at very edge
    
    const blockIndex = blocks.findIndex(b => {
      const s = toMins(b.startTime);
      const e = b.endTime === '00:00' ? 1440 : toMins(b.endTime);
      return mins > s && mins < e;
    });
    
    if (blockIndex !== -1) {
      pushHistory(blocks);
      const target = blocks[blockIndex];
      
      setBlocks(prev => {
        const newBlocks = [...prev];
        newBlocks[blockIndex] = { ...target, endTime: timeStr };
        newBlocks.splice(blockIndex + 1, 0, {
          id: Math.random().toString(),
          startTime: timeStr,
          endTime: target.endTime,
          activityName: '',
          categoryId: target.categoryId,
          isUrgent: target.isUrgent,
          isImportant: target.isImportant,
        });
        return newBlocks;
      });
    }
  };

  const removeBlock = (id: string) => {
    pushHistory(blocks);
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      if (index === -1) return prev;
      
      const newBlocks = [...prev];
      const deletedBlock = newBlocks[index];

      if (newBlocks.length <= 1) return [];

      if (index === 0) {
        newBlocks[1] = { ...newBlocks[1], startTime: deletedBlock.startTime };
      } else {
        newBlocks[index - 1] = { ...newBlocks[index - 1], endTime: deletedBlock.endTime };
      }

      newBlocks.splice(index, 1);
      return newBlocks;
    });
    setAnchorEl(null);
  };

  const splitBlockHalf = (id: string) => {
    pushHistory(blocks);
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      if (index === -1) return prev;
      
      const target = prev[index];
      let startMins = toMins(target.startTime);
      let endMins = target.endTime === '00:00' ? 1440 : toMins(target.endTime);
      
      const dur = endMins - startMins;
      if (dur <= 15) return prev;
      
      const splitDur = Math.floor(dur / 2 / 15) * 15 || 15;
      const midStr = toTimeStr(startMins + splitDur);
      
      const newBlocks = [...prev];
      newBlocks[index] = { ...target, endTime: midStr };
      newBlocks.splice(index + 1, 0, {
        ...target,
        id: Math.random().toString(),
        startTime: midStr,
        endTime: target.endTime,
      });
      return newBlocks;
    });
    setAnchorEl(null);
  };

  const saveLog = async () => {
    if (blocks.length === 0) return;
    setIsSaving(true);
    try {
      const payloadBlocks = blocks.map((b) => {
        const startISO = dayjs(`${date}T${b.startTime}:00`).toISOString();
        let endObj = dayjs(`${date}T${b.endTime}:00`);
        if (b.endTime === '00:00') {
          endObj = endObj.add(1, 'day');
        }
        return {
          ...b,
          startTime: startISO,
          endTime: endObj.toISOString(),
        };
      });

      await axios.post(`http://localhost:5000/api/day-logs/${date}/save`, { blocks: payloadBlocks });
      fetchDayLog();
      setToastMessage('Tasks successfully saved!');
      setToastOpen(true);
    } catch (err) {
      console.error('Failed to save', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset this day? All saved data will be deleted.')) return;
    try {
      await axios.delete(`http://localhost:5000/api/day-logs/${date}`);
      setBlocks(generateDefaultBlocks());
      setHistory([]);
      setToastMessage('Tasks reset to default.');
      setToastOpen(true);
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const displayTime = (timeStr: string) => {
    if (timeStr === '00:00') return useAmPm ? '12:00 AM' : '24:00';
    if (!useAmPm) return timeStr;
    const [h, m] = timeStr.split(':').map(Number);
    const suffix = h >= 12 ? ' PM' : ' AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')}${suffix}`;
  };

  const renderBlockElement = (block: TimeBlock, top: number, height: number, showTopHandle: boolean, showBottomHandle: boolean) => {
    const cat = categories.find(c => c.id === block.categoryId);
    const color = cat?.color || '#3FB950';
    
    return (
      <Box
        id={`block-${block.id}`}
        key={block.id}
        onPointerDown={(e) => handleDragStart(e, block, 'body')}
        sx={{
          position: 'absolute',
          top,
          height,
          left: 4,
          right: 4,
          bgcolor: `${color}15`,
          borderLeft: `4px solid ${color}`,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 1,
          overflow: 'hidden',
          cursor: 'grab',
          transition: 'background-color 0.2s',
          '&:hover': { bgcolor: `${color}25` },
          '&:active': { cursor: 'grabbing' },
          zIndex: 10,
          touchAction: 'none'
        }}
      >
        {showTopHandle && (
          <Box
            className="drag-handle"
            onPointerDown={(e) => handleDragStart(e, block, 'top')}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 10,
              cursor: 'ns-resize',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          />
        )}
        
        <Box sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography sx={{ color: '#E6EDF3', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}>
              {block.activityName || cat?.name || 'Unnamed Task'}
            </Typography>
            <Typography sx={{ color: '#8B949E', fontSize: '0.75rem', ml: 1, whiteSpace: 'nowrap' }}>
              {displayTime(block.startTime)} - {displayTime(block.endTime)}
            </Typography>
          </Box>
          {height >= 45 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
              {block.isUrgent && <Chip size="small" label="Urgent" sx={{ height: 16, fontSize: '0.65rem', bgcolor: 'rgba(210, 153, 34, 0.2)', color: '#D29922' }} />}
              {block.isImportant && <Chip size="small" label="Important" sx={{ height: 16, fontSize: '0.65rem', bgcolor: 'rgba(248, 81, 73, 0.2)', color: '#F85149' }} />}
            </Box>
          )}
        </Box>

        {showBottomHandle && (
          <Box
            className="drag-handle"
            onPointerDown={(e) => handleDragStart(e, block, 'bottom')}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 10,
              cursor: 'ns-resize',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              '&::after': {
                content: '""',
                width: 30,
                height: 4,
                bgcolor: 'rgba(255,255,255,0.3)',
                borderRadius: 2
              }
            }}
          />
        )}
      </Box>
    );
  };

  const editingBlock = blocks.find(b => b.id === editBlockId);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#E6EDF3', fontWeight: 700, mb: 1 }}>
            Record Tasks
          </Typography>
          <Typography sx={{ color: '#8B949E' }}>
            Visually map your day. Drag blocks to move, drag edges to resize. Double-click to split.
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ color: '#8B949E', fontSize: '0.85rem' }}>Effective Ratio</Typography>
            <Typography sx={{ color: effectiveRatio >= 0.8 ? '#3FB950' : '#E6EDF3', fontSize: '1.5rem', fontWeight: 700 }}>
              {(effectiveRatio * 100).toFixed(0)}%
            </Typography>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dayjs(date)}
              onChange={(newValue) => { if (newValue) setDate(newValue.format('YYYY-MM-DD')); }}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { width: 160, input: { color: '#E6EDF3' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }
                },
                popper: {
                  sx: {
                    '& .MuiPaper-root': { bgcolor: '#161B22', color: '#E6EDF3', border: '1px solid rgba(255,255,255,0.1)' },
                    '& .MuiPickersDay-root': { color: '#E6EDF3', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }, '&.Mui-selected': { bgcolor: '#6C9EFF' } },
                    '& .MuiDayCalendar-weekDayLabel': { color: '#8B949E' },
                    '& .MuiIconButton-root': { color: '#8B949E' }
                  }
                }
              }}
            />
          </LocalizationProvider>
          <Tooltip title="Undo last action (Ctrl+Z)">
            <span>
              <Button
                variant="outlined"
                onClick={handleUndo}
                disabled={history.length === 0}
                sx={{ minWidth: 0, px: 2, py: 1, borderColor: 'rgba(255,255,255,0.1)', color: '#E6EDF3' }}
              >
                <UndoRoundedIcon fontSize="small" />
              </Button>
            </span>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            onClick={saveLog}
            disabled={isSaving}
            sx={{ bgcolor: '#6C9EFF', color: '#000', fontWeight: 600, '&:hover': { bgcolor: '#58A6FF' } }}
          >
            {isSaving ? 'Saving...' : 'Save Day'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            color="error"
            sx={{ minWidth: 0, px: 2, borderColor: 'rgba(248, 81, 73, 0.3)' }}
          >
            <RestartAltRoundedIcon fontSize="small" />
          </Button>
        </Box>
      </Box>

      <Paper 
        ref={scrollContainerRef}
        sx={{
          bgcolor: '#0D1117',
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.06)',
          height: 'calc(100vh - 240px)',
          overflowY: 'auto',
          position: 'relative',
          touchAction: 'none'
        }}
      >
        <Box sx={{ display: 'flex', height: TOTAL_HEIGHT, position: 'relative' }}>
          {/* Time Labels */}
          <Box sx={{ width: 80, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', position: 'relative', bgcolor: '#161B22' }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <Typography key={i} sx={{ position: 'absolute', top: i * HOUR_HEIGHT - 10, right: 12, fontSize: '0.75rem', color: '#8B949E', fontWeight: 600 }}>
                {displayTime(`${i.toString().padStart(2, '0')}:00`)}
              </Typography>
            ))}
          </Box>
          
          {/* Timeline */}
          <Box 
            ref={timelineRef}
            onDoubleClick={handleTimelineDoubleClick}
            sx={{ flex: 1, position: 'relative', cursor: 'crosshair', touchAction: 'none' }}
          >
            {/* Grid lines */}
            {Array.from({ length: 24 }).map((_, i) => (
              <Box key={i} sx={{ position: 'absolute', top: i * HOUR_HEIGHT, left: 0, right: 0, height: HOUR_HEIGHT, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, borderBottom: '1px dashed rgba(255,255,255,0.015)' }} />
              </Box>
            ))}
            
            {/* Current Time Indicator */}
            {dayjs().format('YYYY-MM-DD') === date && (
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
            )}

            {/* Blocks rendering */}
            {blocks.map((block, i) => {
              const startMins = toMins(block.startTime);
              const endMins = block.endTime === '00:00' ? 1440 : toMins(block.endTime);
              
              const showTop = i > 0;
              const showBottom = i < blocks.length - 1;
              
              return renderBlockElement(block, startMins, endMins - startMins, showTop, showBottom);
            })}
          </Box>
        </Box>
      </Paper>

      {/* Edit Popover */}
      <Popover
        open={Boolean(anchorEl) && Boolean(editingBlock)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        slotProps={{ paper: { sx: { bgcolor: '#161B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: 2, width: 280, ml: 1 } } }}
      >
        {editingBlock && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ color: '#E6EDF3', fontWeight: 600, fontSize: '0.9rem' }}>
              Edit Task • {displayTime(editingBlock.startTime)} - {displayTime(editingBlock.endTime)}
            </Typography>
            
            <TextField
              size="small"
              placeholder="Activity Name (Optional)"
              value={editingBlock.activityName}
              onChange={(e) => {
                pushHistory(blocks);
                updateBlock(editingBlock.id, 'activityName', e.target.value);
              }}
              fullWidth
              sx={{ input: { color: '#E6EDF3' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }}
            />
            
            <FormControl size="small" fullWidth>
              <Select
                value={editingBlock.categoryId}
                onChange={(e) => {
                  pushHistory(blocks);
                  updateBlock(editingBlock.id, 'categoryId', e.target.value);
                }}
                sx={{ color: '#E6EDF3', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.color }} />
                      {c.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={<Switch size="small" checked={editingBlock.isUrgent} onChange={(e) => { pushHistory(blocks); updateBlock(editingBlock.id, 'isUrgent', e.target.checked); }} color="warning" />}
                label={<Typography sx={{ color: '#E6EDF3', fontSize: '0.85rem' }}>Urgent</Typography>}
              />
              <FormControlLabel
                control={<Switch size="small" checked={editingBlock.isImportant} onChange={(e) => { pushHistory(blocks); updateBlock(editingBlock.id, 'isImportant', e.target.checked); }} color="error" />}
                label={<Typography sx={{ color: '#E6EDF3', fontSize: '0.85rem' }}>Important</Typography>}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <Button fullWidth variant="outlined" startIcon={<ContentCutRoundedIcon />} onClick={() => splitBlockHalf(editingBlock.id)} sx={{ color: '#E6EDF3', borderColor: 'rgba(255,255,255,0.1)' }}>
                Split 50/50
              </Button>
              <Button fullWidth variant="outlined" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => removeBlock(editingBlock.id)} sx={{ color: '#F85149', borderColor: 'rgba(248,81,73,0.3)' }}>
                Merge Up
              </Button>
            </Box>
          </Box>
        )}
      </Popover>

      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToastOpen(false)} severity="success" variant="filled" sx={{ width: '100%', bgcolor: '#3FB950', color: '#fff', fontWeight: 600 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
