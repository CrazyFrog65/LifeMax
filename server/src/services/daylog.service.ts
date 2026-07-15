import { dayLogRepository } from "../repositories/daylog.repository.js";
import prisma from "../config/database.js";


export const dayLogService = {
  getDayLogByDate: async (userId: string, dateString: string) => {
    const date = new Date(dateString);
    return dayLogRepository.findByDate(userId, date);
  },

  saveDayLog: async (
    userId: string,
    dateString: string,
    data: {
      notes?: string;
      sleepHours?: number;
      satisfied?: boolean;
      blocks: {
        startTime: string; // ISO or HH:mm
        endTime: string;
        activityName: string;
        categoryId: string;
        notes?: string;
        isUrgent?: boolean;
        isImportant?: boolean;
      }[];
    }
  ) => {
    const date = new Date(dateString);
    
    // 1. Resolve activity IDs for all blocks (upsert activities)
    const blocksWithActivityIds = await Promise.all(
      data.blocks.map(async (b) => {
        // Upsert Activity by name + user
        let activity = await prisma.activity.findFirst({
          where: {
            userId,
            name: {
              equals: b.activityName,
              mode: 'insensitive',
            },
            categoryId: b.categoryId,
          },
        });

        if (!activity) {
          activity = await prisma.activity.create({
            data: {
              name: b.activityName,
              categoryId: b.categoryId,
              userId,
            },
          });
        }

        // Calculate duration
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);
        const durationMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);

        return {
          activityId: activity.id,
          startTime: start,
          endTime: end,
          durationMinutes: durationMinutes > 0 ? durationMinutes : 0,
          notes: b.notes,
          isUrgent: !!b.isUrgent,
          isImportant: !!b.isImportant,
          categoryId: b.categoryId, // Keep for ratio calculation
        };
      })
    );

    // 2. Calculate Effective Ratio and Sleep Hours
    // Treated as: importantMinutes / awakeMinutes
    // Awake minutes = 1440 - sleepMinutes (duration of blocks under category "Sleep")
    // Important minutes = duration of blocks marked as isImportant (excluding sleep)
    
    const categories = await prisma.category.findMany({ where: { userId } });
    const sleepCat = categories.find(c => c.name.toLowerCase() === "sleep");
    
    let sleepMinutes = 0;
    let importantMinutes = 0;

    for (const b of blocksWithActivityIds) {
      const isSleep = sleepCat && b.categoryId === sleepCat.id;
      if (isSleep) {
        sleepMinutes += b.durationMinutes;
      } else if (b.isImportant) {
        importantMinutes += b.durationMinutes;
      }
    }

    const awakeMinutes = 1440 - sleepMinutes;
    const effectiveRatio = awakeMinutes > 0 ? importantMinutes / awakeMinutes : 0;
    const calculatedSleepHours = sleepMinutes / 60;

    // 3. Save to database via repository
    return dayLogRepository.upsertDayLogWithBlocks(
      userId,
      date,
      {
        notes: data.notes,
        sleepHours: data.sleepHours !== undefined && data.sleepHours !== null ? data.sleepHours : parseFloat(calculatedSleepHours.toFixed(2)),
        satisfied: !!data.satisfied,
        effectiveRatio: parseFloat(effectiveRatio.toFixed(2)),
      },
      blocksWithActivityIds
    );
  },

  deleteDayLog: async (userId: string, dateString: string) => {
    const date = new Date(dateString);
    return dayLogRepository.deleteByDate(userId, date);
  },
};
