import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Snackbar, Alert, Tooltip, Menu, MenuItem, Checkbox } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import SentimentSatisfiedAltRoundedIcon from '@mui/icons-material/SentimentSatisfiedAltRounded';
import SentimentNeutralRoundedIcon from '@mui/icons-material/SentimentNeutralRounded';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useSettings } from '../contexts/SettingsContext';
import type { Category, TimeBlock } from '../types/timeline';
import { fetchCategories, fetchDayLog, fetchDayLogWithStatus, saveDayLog, resetDayLog } from '../services/dayLogService';
import { useCurrentTime } from '../hooks/useCurrentTime';
import { useUndoHistory } from '../hooks/useUndoHistory';
import { useTimeline } from '../hooks/useTimeline';
import { Timeline } from '../components/timeline/Timeline';
import { TimelinePopover } from '../components/timeline/TimelinePopover';

export default function RecordTasks() {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [categories, setCategories] = useState<Category[]>([]);
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'warning' | 'error' | 'info'>('success');
  const [satisfied, setSatisfied] = useState(false);

  const [popoverState, setPopoverState] = useState<{ id: string, top: number, left: number } | null>(null);
  const [contextMenuState, setContextMenuState] = useState<{ id: string, top: number, left: number } | null>(null);

  const closePopover = () => setPopoverState(null);
  const openPopover = (id: string, top: number, left: number) => setPopoverState({ id, top, left });
  const openContextMenu = (id: string, top: number, left: number) => setContextMenuState({ id, top, left });

  const { useAmPm } = useSettings();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentTimeMins = useCurrentTime();

  const { history, pushHistory, handleUndo, clearHistory } = useUndoHistory(setBlocks, closePopover);

  const {
    effectiveRatio,
    handleDragStart,
    handleContextMenu,
    handleTimelineDoubleClick,
    updateBlock,
    removeBlock,
    splitBlockHalf
  } = useTimeline(blocks, setBlocks, pushHistory, openPopover, openContextMenu, closePopover, categories);

  // Auto-scroll to 6 AM on load
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 5 * 60; // 5 * HOUR_HEIGHT
    }
  }, []);

  const loadData = async () => {
    const cats = await fetchCategories();
    setCategories(cats);
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const loadDay = async () => {
      const { blocks: dbBlocks, satisfied: dbSatisfied } = await fetchDayLog(date, categories);
      setBlocks(dbBlocks);
      setSatisfied(dbSatisfied);
      clearHistory();
    };
    if (categories.length > 0) {
      loadDay();
    }
  }, [date, categories, clearHistory]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveDayLog(date, blocks, satisfied);
      const { blocks: dbBlocks, satisfied: dbSatisfied } = await fetchDayLog(date, categories);
      setBlocks(dbBlocks);
      setSatisfied(dbSatisfied);
      setToastMessage('Tasks successfully saved!');
      setToastSeverity('success');
      setToastOpen(true);
    } catch (err) {
      console.error('Failed to save', err);
      setToastMessage('Failed to save tasks.');
      setToastSeverity('error');
      setToastOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset this day? All saved data will be deleted.')) return;
    try {
      await resetDayLog(date);
      const { blocks: dbBlocks, satisfied: dbSatisfied } = await fetchDayLog(date, categories);
      setBlocks(dbBlocks);
      setSatisfied(dbSatisfied);
      clearHistory();
      setToastMessage('Tasks reset to default.');
      setToastSeverity('success');
      setToastOpen(true);
    } catch (err) {
      console.error('Failed to delete', err);
      setToastMessage('Failed to reset tasks.');
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const handleCopyPreviousDay = async () => {
    const prevDate = dayjs(date).subtract(1, 'day').format('YYYY-MM-DD');
    try {
      const { blocks: prevBlocks, satisfied: prevSatisfied, hasData } = await fetchDayLogWithStatus(prevDate, categories);
      if (!hasData) {
        setToastMessage(`No logged tasks found for the previous day (${dayjs(prevDate).format('MMM DD, YYYY')}).`);
        setToastSeverity('warning');
        setToastOpen(true);
        return;
      }
      
      const copiedBlocks = prevBlocks.map(b => ({
        ...b,
        id: Math.random().toString(),
      }));

      pushHistory(blocks);
      setBlocks(copiedBlocks);
      setSatisfied(prevSatisfied);
      setToastMessage(`Successfully copied schedule from ${dayjs(prevDate).format('MMM DD, YYYY')}. Make sure to save!`);
      setToastSeverity('success');
      setToastOpen(true);
    } catch (err) {
      console.error('Failed to copy previous day', err);
      setToastMessage("Error copying previous day's tasks.");
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const editingBlock = blocks.find(b => b.id === popoverState?.id);

  const contextMenuBlock = blocks.find(b => b.id === contextMenuState?.id);
  const contextMenuCategory = categories.find(c => c.id === contextMenuBlock?.categoryId);
  const isContextMenuEmpty = (contextMenuCategory?.name.toLowerCase() === 'none' || contextMenuCategory?.name.toLowerCase() === 'nothing specific') && !contextMenuBlock?.activityName;

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'center' },
        gap: 2,
        mb: 3
      }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#E6EDF3', fontWeight: 700, mb: 0.5, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
            Record Tasks
          </Typography>
          <Typography sx={{ color: '#8B949E', fontSize: { xs: '0.85rem', md: '1rem' } }}>
            Visually map your day. Drag blocks to move, drag edges to resize. Double-click to split.
          </Typography>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 3 },
          flexShrink: 0
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexShrink: 0 }}>
            <Box sx={{ textAlign: 'left' }}>
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
                    sx: { width: 140, input: { color: '#E6EDF3' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }
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
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: { xs: 'space-between', sm: 'flex-start' }, flexShrink: 0, flexWrap: 'wrap' }}>
            <Tooltip title="Undo last action (Ctrl+Z)">
              <Box component="span" sx={{ display: 'inline-flex', flex: { xs: 1, sm: 'initial' } }}>
                <Button
                  variant="outlined"
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  sx={{ width: '100%', minWidth: 0, px: 2, py: 1, borderColor: 'rgba(255,255,255,0.1)', color: '#E6EDF3' }}
                >
                  <UndoRoundedIcon fontSize="small" />
                </Button>
              </Box>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<ContentCopyRoundedIcon />}
              onClick={handleCopyPreviousDay}
              sx={{
                flex: { xs: 2, sm: 'initial' },
                whiteSpace: 'nowrap',
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#E6EDF3',
                fontWeight: 600,
                px: 2.5,
                '&:hover': { borderColor: '#6C9EFF', bgcolor: 'rgba(108, 158, 255, 0.08)' }
              }}
            >
              Copy Previous Day
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              onClick={handleSave}
              disabled={isSaving}
              sx={{
                flex: { xs: 2, sm: 'initial' },
                minWidth: '130px',
                whiteSpace: 'nowrap',
                bgcolor: '#6C9EFF',
                color: '#000',
                fontWeight: 600,
                px: 3,
                '&:hover': { bgcolor: '#58A6FF' }
              }}
            >
              {isSaving ? 'Saving...' : 'Save Day'}
            </Button>
            <Tooltip title="Reset this day (delete all tasks)">
              <Box component="span" sx={{ display: 'inline-flex', flex: { xs: 1, sm: 'initial' } }}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  color="error"
                  sx={{ width: '100%', minWidth: 0, px: 2, borderColor: 'rgba(248, 81, 73, 0.3)' }}
                >
                  <RestartAltRoundedIcon fontSize="small" />
                </Button>
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <Timeline
        date={date}
        currentTimeMins={currentTimeMins}
        blocks={blocks}
        categories={categories}
        useAmPm={useAmPm}
        onDragStart={handleDragStart}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleTimelineDoubleClick}
        scrollContainerRef={scrollContainerRef}
      />

      <Box sx={{
        mt: 3,
        p: 2.5,
        borderRadius: 3,
        bgcolor: '#161B22',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'rgba(108, 158, 255, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: satisfied ? 'rgba(63, 185, 80, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            color: satisfied ? '#3FB950' : '#8B949E',
            transition: 'all 0.3s ease'
          }}>
            {satisfied ? (
              <SentimentSatisfiedAltRoundedIcon sx={{ fontSize: 24 }} />
            ) : (
              <SentimentNeutralRoundedIcon sx={{ fontSize: 24 }} />
            )}
          </Box>
          <Box>
            <Typography sx={{ color: '#E6EDF3', fontWeight: 600, fontSize: '1rem' }}>
              Were you overall satisfied with this day?
            </Typography>
            <Typography sx={{ color: '#8B949E', fontSize: '0.85rem' }}>
              Reflect on your productivity, mood, and overall achievements.
            </Typography>
          </Box>
        </Box>
        <Checkbox
          checked={satisfied}
          onChange={(e) => setSatisfied(e.target.checked)}
          sx={{
            color: 'rgba(255, 255, 255, 0.2)',
            '&.Mui-checked': {
              color: '#3FB950',
            },
            '& .MuiSvgIcon-root': { fontSize: 28 }
          }}
        />
      </Box>

      <TimelinePopover
        popoverState={popoverState}
        editingBlock={editingBlock}
        categories={categories}
        useAmPm={useAmPm}
        onClose={closePopover}
        onUpdateBlock={updateBlock}
        onSplitBlock={splitBlockHalf}
        onRemoveBlock={removeBlock}
        pushHistory={pushHistory}
        blocks={blocks}
      />

      <Menu
        open={contextMenuState !== null}
        onClose={() => setContextMenuState(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenuState
            ? { top: contextMenuState.top, left: contextMenuState.left }
            : undefined
        }
        slotProps={{ paper: { sx: { bgcolor: '#161B22', border: '1px solid rgba(255,255,255,0.1)', color: '#E6EDF3', minWidth: 120 } } }}
      >
        {isContextMenuEmpty ? (
          <MenuItem onClick={() => {
            if (contextMenuState) {
              openPopover(contextMenuState.id, contextMenuState.top, contextMenuState.left);
              setContextMenuState(null);
            }
          }} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
            Add task
          </MenuItem>
        ) : (
          [
            <MenuItem key="edit" onClick={() => {
              if (contextMenuState) {
                openPopover(contextMenuState.id, contextMenuState.top, contextMenuState.left);
                setContextMenuState(null);
              }
            }} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
              Edit
            </MenuItem>,
            <MenuItem key="delete" onClick={() => {
              if (contextMenuState) {
                removeBlock(contextMenuState.id);
                setContextMenuState(null);
              }
            }} sx={{ color: '#F85149', '&:hover': { bgcolor: 'rgba(248, 81, 73, 0.1)' } }}>
              Delete
            </MenuItem>
          ]
        )}
      </Menu>

      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          variant="filled"
          sx={{
            width: '100%',
            bgcolor: toastSeverity === 'success' ? '#3FB950' : toastSeverity === 'warning' ? '#D29922' : toastSeverity === 'error' ? '#F85149' : '#388BFD',
            color: '#fff',
            fontWeight: 600
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
