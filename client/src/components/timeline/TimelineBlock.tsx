import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import type { TimeBlock, Category } from '../../types/timeline';
import { displayTime, toMins } from '../../utils/time';

interface TimelineBlockProps {
  block: TimeBlock;
  category?: Category;
  showTopHandle: boolean;
  showBottomHandle: boolean;
  useAmPm: boolean;
  onDragStart: (e: React.PointerEvent, block: TimeBlock, mode: 'top' | 'bottom' | 'body') => void;
  onContextMenu: (e: React.MouseEvent, block: TimeBlock) => void;
}

export const TimelineBlock = React.memo(({
  block,
  category,
  showTopHandle,
  showBottomHandle,
  useAmPm,
  onDragStart,
  onContextMenu
}: TimelineBlockProps) => {
  const startMins = toMins(block.startTime);
  const endMins = block.endTime === '00:00' ? 1440 : toMins(block.endTime);
  const top = startMins;
  const height = endMins - startMins;
  const color = category?.color || '#3FB950';
  const isNone = category?.name.toLowerCase() === 'none' || category?.name.toLowerCase() === 'nothing specific';
  const isEmpty = isNone && !block.activityName;

  return (
    <Box
      id={`block-${block.id}`}
      onPointerDown={(e) => {
        if (e.button === 0) onDragStart(e, block, 'body');
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e, block);
      }}
      sx={{
        position: 'absolute',
        top,
        height,
        left: 4,
        right: 4,
        bgcolor: isEmpty ? 'transparent' : `${color}15`,
        borderLeft: isEmpty ? 'none' : `4px solid ${color}`,
        borderTop: isEmpty ? 'none' : '1px solid rgba(255,255,255,0.05)',
        borderBottom: isEmpty ? 'none' : '1px solid rgba(255,255,255,0.05)',
        borderRadius: 0,
        overflow: 'hidden',
        cursor: 'grab',
        transition: 'background-color 0.2s',
        '&:hover': { bgcolor: isEmpty ? 'rgba(255,255,255,0.02)' : `${color}25` },
        '&:active': { cursor: 'grabbing' },
        zIndex: isEmpty ? 5 : 10,
        touchAction: 'none'
      }}
    >
      {showTopHandle && (
        <Box
          className="drag-handle"
          onPointerDown={(e) => onDragStart(e, block, 'top')}
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
      {!isEmpty && (
        <Box sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography sx={{ color: '#E6EDF3', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}>
              {block.activityName || category?.name || 'Unnamed Task'}
            </Typography>
            <Typography sx={{ color: '#8B949E', fontSize: '0.75rem', ml: 1, whiteSpace: 'nowrap' }}>
              {displayTime(block.startTime, useAmPm)} - {displayTime(block.endTime, useAmPm)}
            </Typography>
          </Box>
          {height >= 45 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
              {block.isUrgent && <Chip size="small" label="Urgent" sx={{ height: 16, fontSize: '0.65rem', bgcolor: 'rgba(210, 153, 34, 0.2)', color: '#D29922' }} />}
              {block.isImportant && <Chip size="small" label="Important" sx={{ height: 16, fontSize: '0.65rem', bgcolor: 'rgba(248, 81, 73, 0.2)', color: '#F85149' }} />}
            </Box>
          )}
        </Box>
      )}

      {showBottomHandle && (
        <Box
          className="drag-handle"
          onPointerDown={(e) => onDragStart(e, block, 'bottom')}
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
});
