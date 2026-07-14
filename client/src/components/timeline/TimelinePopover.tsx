import React from 'react';
import { Box, Typography, TextField, FormControl, Select, MenuItem, FormControlLabel, Switch, Button, Popover, useMediaQuery } from '@mui/material';
import ContentCutRoundedIcon from '@mui/icons-material/ContentCutRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import type { TimeBlock, Category } from '../../types/timeline';
import { displayTime } from '../../utils/time';

interface TimelinePopoverProps {
  popoverState: { id: string, top: number, left: number } | null;
  editingBlock: TimeBlock | undefined;
  categories: Category[];
  useAmPm: boolean;
  onClose: () => void;
  onUpdateBlock: (id: string, field: keyof TimeBlock, value: any) => void;
  onSplitBlock: (id: string) => void;
  onRemoveBlock: (id: string) => void;
  pushHistory: (blocks: TimeBlock[]) => void;
  blocks: TimeBlock[];
}

export const TimelinePopover: React.FC<TimelinePopoverProps> = ({
  popoverState,
  editingBlock,
  categories,
  useAmPm,
  onClose,
  onUpdateBlock,
  onSplitBlock,
  onRemoveBlock,
  pushHistory,
  blocks
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Popover
      open={Boolean(popoverState) && Boolean(editingBlock)}
      onClose={onClose}
      anchorReference={isMobile ? 'none' : 'anchorPosition'}
      anchorPosition={!isMobile && popoverState ? { top: popoverState.top, left: popoverState.left } : undefined}
      transformOrigin={isMobile ? { vertical: 'center', horizontal: 'center' } : { vertical: 'top', horizontal: 'left' }}
      slotProps={{ paper: { sx: { bgcolor: '#161B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: isMobile ? 3 : 2, width: isMobile ? '90%' : 280, maxWidth: 320 } } }}
    >
      {editingBlock && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ color: '#E6EDF3', fontWeight: 600, fontSize: '0.9rem' }}>
            Edit Task • {displayTime(editingBlock.startTime, useAmPm)} - {displayTime(editingBlock.endTime, useAmPm)}
          </Typography>
          
          <TextField
            size="small"
            placeholder="Activity Name (Optional)"
            value={editingBlock.activityName}
            onChange={(e) => {
              pushHistory(blocks);
              onUpdateBlock(editingBlock.id, 'activityName', e.target.value);
            }}
            fullWidth
            sx={{ input: { color: '#E6EDF3' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }}
          />
          
          <FormControl size="small" fullWidth>
            <Select
              value={editingBlock.categoryId}
              onChange={(e) => {
                pushHistory(blocks);
                onUpdateBlock(editingBlock.id, 'categoryId', e.target.value);
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
              control={<Switch size="small" checked={editingBlock.isUrgent} onChange={(e) => { pushHistory(blocks); onUpdateBlock(editingBlock.id, 'isUrgent', e.target.checked); }} color="warning" />}
              label={<Typography sx={{ color: '#E6EDF3', fontSize: '0.85rem' }}>Urgent</Typography>}
            />
            <FormControlLabel
              control={<Switch size="small" checked={editingBlock.isImportant} onChange={(e) => { pushHistory(blocks); onUpdateBlock(editingBlock.id, 'isImportant', e.target.checked); }} color="error" />}
              label={<Typography sx={{ color: '#E6EDF3', fontSize: '0.85rem' }}>Important</Typography>}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Button fullWidth variant="outlined" startIcon={<ContentCutRoundedIcon />} onClick={() => onSplitBlock(editingBlock.id)} sx={{ color: '#E6EDF3', borderColor: 'rgba(255,255,255,0.1)' }}>
              Split 50/50
            </Button>
            <Button fullWidth variant="outlined" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => onRemoveBlock(editingBlock.id)} sx={{ color: '#F85149', borderColor: 'rgba(248,81,73,0.3)' }}>
              Merge Up
            </Button>
          </Box>
        </Box>
      )}
    </Popover>
  );
};
