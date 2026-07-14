import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Snackbar, Alert, Tooltip, Menu, MenuItem } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useSettings } from '../contexts/SettingsContext';
import type { Category, TimeBlock } from '../types/timeline';
import { fetchCategories, fetchDayLog, saveDayLog, resetDayLog } from '../services/dayLogService';
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
      const dbBlocks = await fetchDayLog(date, categories);
      setBlocks(dbBlocks);
      clearHistory();
    };
    if (categories.length > 0) {
      loadDay();
    }
  }, [date, categories, clearHistory]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveDayLog(date, blocks);
      const dbBlocks = await fetchDayLog(date, categories);
      setBlocks(dbBlocks);
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
      await resetDayLog(date);
      const dbBlocks = await fetchDayLog(date, categories);
      setBlocks(dbBlocks);
      clearHistory();
      setToastMessage('Tasks reset to default.');
      setToastOpen(true);
    } catch (err) {
      console.error('Failed to delete', err);
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
          gap: { xs: 2, sm: 3 } 
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
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
          
          <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'space-between', sm: 'flex-start' } }}>
            <Tooltip title="Undo last action (Ctrl+Z)">
              <span style={{ display: 'inline-flex', flex: { xs: 1, sm: 'initial' } }}>
                <Button
                  variant="outlined"
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  sx={{ width: '100%', minWidth: 0, px: 2, py: 1, borderColor: 'rgba(255,255,255,0.1)', color: '#E6EDF3' }}
                >
                  <UndoRoundedIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              onClick={handleSave}
              disabled={isSaving}
              sx={{ flex: 2, bgcolor: '#6C9EFF', color: '#000', fontWeight: 600, '&:hover': { bgcolor: '#58A6FF' } }}
            >
              {isSaving ? 'Saving...' : 'Save Day'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              color="error"
              sx={{ width: '100%', minWidth: 0, px: 2, borderColor: 'rgba(248, 81, 73, 0.3)', flex: { xs: 1, sm: 'initial' } }}
            >
              <RestartAltRoundedIcon fontSize="small" />
            </Button>
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
        <Alert onClose={() => setToastOpen(false)} severity="success" variant="filled" sx={{ width: '100%', bgcolor: '#3FB950', color: '#fff', fontWeight: 600 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
