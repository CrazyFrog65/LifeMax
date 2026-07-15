import prisma from "../config/database.js";
import { Prisma } from "../../generated/prisma/client.js";

export const dayLogRepository = {
  findByDate: async (userId: string, date: Date) => {
    return prisma.dayLog.findUnique({
      where: { userId_date: { userId, date } },
      include: {
        timeBlocks: {
          include: { activity: { include: { category: true } } }
        },
      },
    });
  },

  upsertDayLogWithBlocks: async (
    userId: string,
    date: Date,
    dayLogData: { notes?: string; sleepHours?: number; effectiveRatio?: number; satisfied?: boolean },
    blocksData: any[] // We'll type this properly in service
  ) => {
    return prisma.$transaction(async (tx) => {
      // Upsert the DayLog
      const dayLog = await tx.dayLog.upsert({
        where: { userId_date: { userId, date } },
        update: { ...dayLogData },
        create: { ...dayLogData, userId, date },
      });

      // Delete existing TimeBlocks for this day
      await tx.timeBlock.deleteMany({
        where: { dayLogId: dayLog.id },
      });

      // Insert new TimeBlocks
      if (blocksData.length > 0) {
        await tx.timeBlock.createMany({
          data: blocksData.map((b) => ({
            dayLogId: dayLog.id,
            activityId: b.activityId,
            startTime: b.startTime,
            endTime: b.endTime,
            durationMinutes: b.durationMinutes,
            notes: b.notes,
            isUrgent: b.isUrgent,
            isImportant: b.isImportant,
          })),
        });
      }

      return tx.dayLog.findUnique({
        where: { id: dayLog.id },
        include: {
          timeBlocks: {
            include: { activity: { include: { category: true } } },
          },
        },
      });
    });
  },

  deleteByDate: async (userId: string, date: Date) => {
    return prisma.dayLog.deleteMany({
      where: { userId, date },
    });
  },
};
