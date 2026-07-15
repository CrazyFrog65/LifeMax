import axios from '../utils/apiClient';
import type { TimeBlock, Category } from '../types/timeline';
import dayjs from 'dayjs';
import { repairTimelineGaps, generateDefaultBlocks } from '../utils/timeline';
import { toMins } from '../utils/time';

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const res = await axios.get('http://localhost:5000/api/categories');
    if (res.data.success) return res.data.data;
    return [];
  } catch (err) {
    console.error('Failed to load categories', err);
    return [];
  }
};

export const fetchDayLogWithStatus = async (date: string, categories: Category[]): Promise<{ blocks: TimeBlock[]; satisfied: boolean; hasData: boolean }> => {
  if (categories.length === 0) return { blocks: [], satisfied: false, hasData: false };
  try {
    const res = await axios.get(`http://localhost:5000/api/day-logs/${date}`);
    if (res.data.success && res.data.data) {
      const dbBlocks: TimeBlock[] = [];
      res.data.data.timeBlocks.forEach((b: any) => {
        const s = dayjs(b.startTime).format('HH:mm');
        const e = dayjs(b.endTime).format('HH:mm');
        
        if (toMins(s) > toMins(e) && e !== '00:00') {
          dbBlocks.push({
            id: Math.random().toString(),
            startTime: s,
            endTime: '00:00',
            activityName: b.activity.name,
            categoryId: b.activity.categoryId,
            isUrgent: b.isUrgent,
            isImportant: b.isImportant,
          });
          dbBlocks.push({
            id: Math.random().toString(),
            startTime: '00:00',
            endTime: e,
            activityName: b.activity.name,
            categoryId: b.activity.categoryId,
            isUrgent: b.isUrgent,
            isImportant: b.isImportant,
          });
        } else {
          dbBlocks.push({
            id: Math.random().toString(),
            startTime: s,
            endTime: e,
            activityName: b.activity.name,
            categoryId: b.activity.categoryId,
            isUrgent: b.isUrgent,
            isImportant: b.isImportant,
          });
        }
      });
      
      dbBlocks.sort((a, b) => toMins(a.startTime) - toMins(b.startTime));
      return {
        blocks: repairTimelineGaps(dbBlocks, categories),
        satisfied: res.data.data.satisfied || false,
        hasData: true,
      };
    } else {
      return {
        blocks: generateDefaultBlocks(categories),
        satisfied: false,
        hasData: false,
      };
    }
  } catch (err) {
    console.error('Failed to load day log', err);
    return {
      blocks: generateDefaultBlocks(categories),
      satisfied: false,
      hasData: false,
    };
  }
};

export const fetchDayLog = async (date: string, categories: Category[]): Promise<{ blocks: TimeBlock[]; satisfied: boolean }> => {
  const result = await fetchDayLogWithStatus(date, categories);
  return { blocks: result.blocks, satisfied: result.satisfied };
};

export const saveDayLog = async (date: string, blocks: TimeBlock[], satisfied: boolean) => {
  if (blocks.length === 0) return;
  const payloadBlocks = blocks.map((b) => {
    const startISO = dayjs(`${date}T${b.startTime}:00`).toISOString();
    let endObj = dayjs(`${date}T${b.endTime}:00`);
    if (b.endTime === '00:00') {
      endObj = endObj.add(1, 'day');
    }
    return {
      ...b,
      startTime: startISO,
      endTime: endObj.toISOString(),
    };
  });
  await axios.post(`http://localhost:5000/api/day-logs/${date}/save`, { blocks: payloadBlocks, satisfied });
};

export const resetDayLog = async (date: string) => {
  await axios.delete(`http://localhost:5000/api/day-logs/${date}`);
};
