import { useState, useCallback, useEffect } from 'react';
import type { TimeBlock } from '../types/timeline';

export function useUndoHistory(
  setBlocks: React.Dispatch<React.SetStateAction<TimeBlock[]>>,
  setAnchorEl: (el: HTMLElement | null) => void
) {
  const [history, setHistory] = useState<TimeBlock[][]>([]);

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
  }, [setBlocks, setAnchorEl]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUndo]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, pushHistory, handleUndo, clearHistory };
}
