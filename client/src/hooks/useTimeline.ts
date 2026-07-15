import { useCallback, useRef, useEffect, useState } from 'react';
import type { TimeBlock, Category } from '../types/timeline';
import { toMins, toTimeStr } from '../utils/time';

export function useTimeline(
  blocks: TimeBlock[],
  setBlocks: React.Dispatch<React.SetStateAction<TimeBlock[]>>,
  pushHistory: (blocks: TimeBlock[]) => void,
  openPopover: (id: string, top: number, left: number) => void,
  openContextMenu: (id: string, top: number, left: number) => void,
  closePopover: () => void,
  categories: Category[]
) {
  const [effectiveRatio, setEffectiveRatio] = useState<number>(0);

  const categoriesRef = useRef<Category[]>([]);
  useEffect(() => {
    categoriesRef.current = categories;
  }, [categories]);

  useEffect(() => {
    if (categories.length === 0) {
      setEffectiveRatio(0);
      return;
    }
    const sleepCat = categories.find((c) => c.name.toLowerCase() === 'sleep');
    let sleepMinutes = 0;
    let importantMinutes = 0;

    blocks.forEach((b) => {
      let dur = toMins(b.endTime) - toMins(b.startTime);
      if (dur <= 0 && b.endTime === '00:00') dur += 24 * 60;
      if (dur < 0) dur += 24 * 60;

      const isSleep = sleepCat && b.categoryId === sleepCat.id;
      if (isSleep) {
        sleepMinutes += dur;
      } else if (b.isImportant) {
        importantMinutes += dur;
      }
    });

    const awakeMinutes = 1440 - sleepMinutes;
    setEffectiveRatio(awakeMinutes > 0 ? importantMinutes / awakeMinutes : 0);
  }, [blocks, categories]);

  const moveBlockBoundaries = useCallback((id: string, _mode: 'top' | 'bottom' | 'body', newStartMins: number, newEndMins: number) => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      if (index === -1) return prev;

      const target = prev[index];

      const formatTime = (m: number) => m === 1440 ? '00:00' : toTimeStr(m);

      const newStartTimeStr = formatTime(newStartMins);
      const newEndTimeStr = formatTime(newEndMins);

      if (target.startTime === newStartTimeStr && target.endTime === newEndTimeStr) {
        return prev;
      }

      const newBlocks = [...prev];
      newBlocks[index] = { ...target, startTime: newStartTimeStr, endTime: newEndTimeStr };

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

  const handleDragStart = useCallback((e: React.PointerEvent, block: TimeBlock, mode: 'top' | 'bottom' | 'body') => {
    e.preventDefault();
    e.stopPropagation();

    closePopover();

    const index = blocks.findIndex(b => b.id === block.id);
    if (index === -1) return;

    const getMins = (time: string, isEnd: boolean) => {
      const m = toMins(time);
      if (isEnd && m === 0) return 1440;
      return m;
    };

    const initialStartMins = getMins(block.startTime, false);
    const initialEndMins = getMins(block.endTime, true);
    const targetDur = initialEndMins - initialStartMins;

    let minDelta = 0;
    let maxDelta = 0;

    if (mode === 'top') {
      minDelta = -initialStartMins;
      maxDelta = targetDur - 15;
    } else if (mode === 'bottom') {
      minDelta = -(targetDur - 15);
      maxDelta = 1440 - initialEndMins;
    } else if (mode === 'body') {
      minDelta = -initialStartMins;
      maxDelta = 1440 - initialEndMins;
    }

    const startY = e.clientY;

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
        openPopover(block.id, upEvent.clientY, upEvent.clientX);
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [blocks, pushHistory, openPopover, closePopover, moveBlockBoundaries]);

  const handleTimelineDoubleClick = useCallback((e: React.MouseEvent, timelineRef: React.RefObject<HTMLDivElement | null>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top - 12; // Adjust for pt: '12px' padding
    const mins = Math.max(0, Math.round(y / 15) * 15);
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
    } else {
      pushHistory(blocks);

      const nextBlock = blocks
        .filter(b => toMins(b.startTime) >= mins)
        .sort((a, b) => toMins(a.startTime) - toMins(b.startTime))[0];

      const nextStart = nextBlock ? toMins(nextBlock.startTime) : 1440;
      const duration = Math.min(60, nextStart - mins);
      if (duration < 15) return;

      const endTimeStr = toTimeStr(mins + duration);
      const defaultCat = categories[0]?.id || '';

      setBlocks(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          startTime: timeStr,
          endTime: endTimeStr,
          activityName: 'New Task',
          categoryId: defaultCat,
          isUrgent: false,
          isImportant: false,
        }
      ].sort((a, b) => toMins(a.startTime) - toMins(b.startTime)));
    }
  }, [blocks, pushHistory, categories]);

  const removeBlock = useCallback((id: string) => {
    pushHistory(blocks);
    setBlocks(prev => prev.filter(b => b.id !== id));
    closePopover();
  }, [blocks, pushHistory, closePopover]);

  const splitBlockHalf = useCallback((id: string) => {
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
    closePopover();
  }, [blocks, pushHistory, closePopover]);

  const handleContextMenu = useCallback((e: React.MouseEvent, block: TimeBlock) => {
    openContextMenu(block.id, e.clientY, e.clientX);
  }, [openContextMenu]);

  return {
    effectiveRatio,
    handleDragStart,
    handleContextMenu,
    handleTimelineDoubleClick,
    updateBlock,
    removeBlock,
    splitBlockHalf
  };
}
