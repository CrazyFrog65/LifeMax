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
          where: { userId, name: b.activityName, categoryId: b.categoryId },
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

    // 2. Calculate Effective Ratio
    // Total Minutes = sum of all block durations
    // Nothing Specific Minutes = sum of block durations where category is "Nothing Specific"
    
    const categories = await prisma.category.findMany({ where: { userId } });
    const nothingSpecificCat = categories.find(c => c.name.toLowerCase() === "nothing specific");
    
    let totalMinutes = 0;
    let nsMinutes = 0;

    for (const b of blocksWithActivityIds) {
      totalMinutes += b.durationMinutes;
      if (nothingSpecificCat && b.categoryId === nothingSpecificCat.id) {
        nsMinutes += b.durationMinutes;
      }
    }

    const effectiveRatio = totalMinutes > 0 ? (totalMinutes - nsMinutes) / totalMinutes : 0;

    // 3. Save to database via repository
    return dayLogRepository.upsertDayLogWithBlocks(
      userId,
      date,
      {
        notes: data.notes,
        sleepHours: data.sleepHours,
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
