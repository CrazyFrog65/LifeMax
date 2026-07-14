import type { TimeBlock, Category } from '../types/timeline';
import { toMins } from './time';

export const generateDefaultBlocks = (categories: Category[]): TimeBlock[] => {
  if (categories.length === 0) return [];
  const sleepCat = categories.find(c => c.name.toLowerCase() === 'sleep')?.id || categories[0].id;

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

export const repairTimelineGaps = (dbBlocks: TimeBlock[], _categories: Category[]): TimeBlock[] => {
  return [...dbBlocks].sort((a, b) => toMins(a.startTime) - toMins(b.startTime));
};
