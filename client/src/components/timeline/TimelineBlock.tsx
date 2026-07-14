import React, { useState, useRef, useEffect } from 'react';
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

  const [isPopped, setIsPopped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleBodyPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;

    const isMobile = e.pointerType === 'touch' || window.innerWidth <= 768;

    if (isMobile) {
      e.persist();

      const startX = e.clientX;
      const startY = e.clientY;

      const clearDragTimer = () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };

      const onMove = (moveEv: PointerEvent) => {
        if (Math.abs(moveEv.clientX - startX) > 10 || Math.abs(moveEv.clientY - startY) > 10) {
          clearDragTimer();
          window.removeEventListener('pointermove', onMove);
        }
      };

      const onUp = () => {
        clearDragTimer();
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        setIsPopped(false);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      timerRef.current = setTimeout(() => {
        clearDragTimer();
        window.removeEventListener('pointermove', onMove);
        setIsPopped(true);

        onDragStart(e, block, 'body');

        const onDragEnd = () => {
          setIsPopped(false);
          window.removeEventListener('pointerup', onDragEnd);
        };
        window.addEventListener('pointerup', onDragEnd);
      }, 200);

    } else {
      onDragStart(e, block, 'body');
    }
  };

  return (
    <Box
      id={`block-${block.id}`}
      onPointerDown={handleBodyPointerDown}
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
        boxShadow: isPopped ? '0 8px 16px rgba(0, 0, 0, 0.3)' : (isEmpty ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.15)'),
        transform: isPopped ? 'scale(1.02)' : 'none',
        overflow: 'hidden',
        cursor: 'grab',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease, background-color 0.2s ease',
        '&:hover': {
          bgcolor: isEmpty ? 'rgba(255,255,255,0.02)' : color,
          boxShadow: isPopped ? '0 8px 16px rgba(0, 0, 0, 0.3)' : (isEmpty ? 'none' : '0 3px 6px rgba(0, 0, 0, 0.2)'),
          filter: isEmpty ? 'none' : 'brightness(1.05)'
        },
        '&:active': { cursor: 'grabbing' },
        zIndex: isPopped ? 20 : (isEmpty ? 5 : 10),
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
