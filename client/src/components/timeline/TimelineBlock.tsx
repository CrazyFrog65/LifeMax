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
        height: Math.max(15, height), // Ensure a minimum height for short blocks
        left: 6,
        right: 6,
        bgcolor: isEmpty ? 'transparent' : color,
        borderLeft: isEmpty ? 'none' : `4px solid rgba(0, 0, 0, 0.18)`,
        border: isEmpty ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: isEmpty ? 0 : '8px',
        boxShadow: isEmpty ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        cursor: 'grab',
        transition: 'box-shadow 0.2s ease, filter 0.2s ease, background-color 0.2s ease',
        '&:hover': {
          bgcolor: isEmpty ? 'rgba(255,255,255,0.02)' : color,
          boxShadow: isEmpty ? 'none' : '0 3px 6px rgba(0, 0, 0, 0.2)',
          filter: isEmpty ? 'none' : 'brightness(1.05)'
        },
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
            height: 8,
            cursor: 'ns-resize',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 15,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
          }}
        />
      )}
      {!isEmpty && (
        <Box sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
          <Box sx={{
            display: 'flex',
            flexDirection: height <= 35 ? 'row' : 'column',
            alignItems: height <= 35 ? 'center' : 'flex-start',
            gap: height <= 35 ? 1 : 0.2,
            justifyContent: 'flex-start'
          }}>
            <Typography sx={{ color: '#1A1A1A', fontWeight: 700, fontSize: '0.825rem', lineHeight: 1.2 }}>
              {block.activityName || category?.name || 'Unnamed Task'}
            </Typography>
            <Typography sx={{ color: 'rgba(26, 26, 26, 0.7)', fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {displayTime(block.startTime, useAmPm)} – {displayTime(block.endTime, useAmPm)}
            </Typography>
          </Box>
          {height >= 45 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
              {block.isUrgent && <Chip size="small" label="Urgent" sx={{ height: 16, fontSize: '0.625rem', fontWeight: 600, bgcolor: 'rgba(0, 0, 0, 0.08)', color: '#1A1A1A', border: '1px solid rgba(0,0,0,0.12)' }} />}
              {block.isImportant && <Chip size="small" label="Important" sx={{ height: 16, fontSize: '0.625rem', fontWeight: 600, bgcolor: 'rgba(0, 0, 0, 0.08)', color: '#1A1A1A', border: '1px solid rgba(0,0,0,0.12)' }} />}
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
            height: 8,
            cursor: 'ns-resize',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 15,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
            '&::after': {
              content: '""',
              width: 30,
              height: 3,
              bgcolor: 'rgba(0,0,0,0.18)',
              borderRadius: 2
            }
          }}
        />
      )}
    </Box>
  );
});
