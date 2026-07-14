import React, { useRef } from 'react';
import { Box, Paper } from '@mui/material';
import { TimeLabels } from './TimeLabels';
import { TimelineGrid } from './TimelineGrid';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { TimelineBlock } from './TimelineBlock';
import type { TimeBlock, Category } from '../../types/timeline';

interface TimelineProps {
  date: string;
  currentTimeMins: number;
  blocks: TimeBlock[];
  categories: Category[];
  useAmPm: boolean;
  onDragStart: (e: React.PointerEvent, block: TimeBlock, mode: 'top' | 'bottom' | 'body') => void;
  onContextMenu: (e: React.MouseEvent, block: TimeBlock) => void;
  onDoubleClick: (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

const TOTAL_HEIGHT = 24 * 60;

export const Timeline: React.FC<TimelineProps> = ({
  date,
  currentTimeMins,
  blocks,
  categories,
  useAmPm,
  onDragStart,
  onContextMenu,
  onDoubleClick,
  scrollContainerRef
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  return (
    <Paper 
      ref={scrollContainerRef}
      sx={{
        bgcolor: '#0D1117',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 0,
        height: { xs: 'calc(100vh - 350px)', sm: 'calc(100vh - 240px)' },
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      <Box sx={{ display: 'flex', height: TOTAL_HEIGHT + 24, position: 'relative' }}>
        <TimeLabels useAmPm={useAmPm} />
        
        <Box 
          ref={timelineRef}
          onDoubleClick={(e) => onDoubleClick(e, timelineRef)}
          sx={{ flex: 1, position: 'relative', cursor: 'crosshair' }}
        >
          <Box sx={{ position: 'relative', top: 12, height: TOTAL_HEIGHT }}>
            <TimelineGrid />
            <CurrentTimeIndicator date={date} currentTimeMins={currentTimeMins} />

            {blocks.map((block, i) => {
              const showTop = i > 0;
              const showBottom = i < blocks.length - 1;
              const category = categories.find((c) => c.id === block.categoryId);
              return (
                <TimelineBlock
                  key={block.id}
                  block={block}
                  category={category}
                  showTopHandle={showTop}
                  showBottomHandle={showBottom}
                  useAmPm={useAmPm}
                  onDragStart={onDragStart}
                  onContextMenu={onContextMenu}
                />
              );
            })}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
