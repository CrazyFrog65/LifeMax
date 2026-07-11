import prisma from "../config/database.js";

export const analyticsService = {
  getWeeklyAnalytics: async (userId: string) => {
    // Generate the last 7 days as YYYY-MM-DD strings in local time
    const dateStrings = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dateStrings.push(`${y}-${m}-${day}`);
    }
    
    // oldest date in UTC Date format for Prisma query
    const sevenDaysAgo = new Date(dateStrings[0]); 

    // 2. Fetch DayLogs from the last 7 days with time blocks and categories
    const dayLogs = await prisma.dayLog.findMany({
      where: {
        userId,
        date: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        timeBlocks: {
          include: {
            activity: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    // 3. Process Bar Chart Data (Total hours per day for the last 7 days)
    const barChart = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    for (const dateStr of dateStrings) {
      // log.date is stored as UTC midnight because it was created via new Date('YYYY-MM-DD')
      const dayLog = dayLogs.find(log => log.date.toISOString().split('T')[0] === dateStr);
      let totalMinutes = 0;
      
      if (dayLog) {
        totalMinutes = dayLog.timeBlocks.reduce((sum, block) => sum + block.durationMinutes, 0);
      }
      
      const d = new Date(dateStr); // Parses as UTC midnight
      barChart.push({
        day: days[d.getUTCDay()],
        hours: parseFloat((totalMinutes / 60).toFixed(1)),
      });
    }

    // 4. Process Pie Chart Data (Total hours per category for the week)
    const categoryTotals: Record<string, { name: string; hours: number; color: string }> = {};
    
    dayLogs.forEach(log => {
      log.timeBlocks.forEach(block => {
        const cat = block.activity.category;
        if (!categoryTotals[cat.id]) {
          categoryTotals[cat.id] = {
            name: cat.name,
            hours: 0,
            color: cat.color || "#8B949E",
          };
        }
        categoryTotals[cat.id].hours += block.durationMinutes / 60;
      });
    });

    const pieChart = Object.values(categoryTotals).map(item => ({
      ...item,
      hours: parseFloat(item.hours.toFixed(1)),
    })).filter(item => item.hours > 0);

    return {
      barChart,
      pieChart,
    };
  },

  getTrendsAnalytics: async (userId: string) => {
    // Generate the last 30 days as YYYY-MM-DD strings in local time
    const dateStrings = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dateStrings.push(`${y}-${m}-${day}`);
    }
    
    const thirtyDaysAgo = new Date(dateStrings[0]);

    const dayLogs = await prisma.dayLog.findMany({
      where: {
        userId,
        date: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        timeBlocks: {
          include: {
            activity: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'asc',
      }
    });

    const weeklyTrend = [];
    const monthlyTrend = [];
    
    const categoryBreakdown: any[] = [];
    const productiveVsUnproductive: any[] = [];
    const eisenhowerDistribution: any[] = [];
    const sleepTrend: any[] = [];
    
    const activityTotals: Record<string, number> = {};

    // Helper to format date like "Jul 10" from a YYYY-MM-DD string
    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr); // Parses as UTC
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
    };

    for (let i = 0; i < 30; i++) {
      const dateStr = dateStrings[i];
      const dayLog = dayLogs.find(log => log.date.toISOString().split('T')[0] === dateStr);
      const formattedDate = formatDate(dateStr);
      
      const ratio = dayLog?.effectiveRatio ? Math.round(dayLog.effectiveRatio * 100) : 0;
      
      const point = {
        date: formattedDate,
        ratio,
      };

      monthlyTrend.push(point);
      if (i >= 23) {
        weeklyTrend.push(point);
      }

      // Initialize trend data points for this day
      const catBreakdownPoint: any = { date: formattedDate };
      let prodHours = 0;
      let unprodHours = 0;
      let doHours = 0;
      let scheduleHours = 0;
      let delegateHours = 0;
      let eliminateHours = 0;

      if (dayLog) {
        // Sleep trend
        sleepTrend.push({
          date: formattedDate,
          hours: dayLog.sleepHours || 0,
        });

        // TimeBlocks processing
        for (const block of dayLog.timeBlocks) {
          const hours = block.durationMinutes / 60;
          const cat = block.activity.category;
          
          // Category Breakdown
          if (!catBreakdownPoint[cat.name]) catBreakdownPoint[cat.name] = 0;
          catBreakdownPoint[cat.name] += hours;

          // Productive vs Unproductive
          if (cat.productive) {
            prodHours += hours;
          } else {
            unprodHours += hours;
          }

          // Eisenhower Distribution
          const isUrgent = block.isUrgent;
          const isImportant = block.isImportant;
          if (isUrgent && isImportant) doHours += hours;
          else if (!isUrgent && isImportant) scheduleHours += hours;
          else if (isUrgent && !isImportant) delegateHours += hours;
          else eliminateHours += hours;

          // Top Activities
          if (!activityTotals[block.activity.name]) {
            activityTotals[block.activity.name] = 0;
          }
          activityTotals[block.activity.name] += hours;
        }
      } else {
        sleepTrend.push({ date: formattedDate, hours: 0 });
      }

      // Format point values for this day
      // Only keep categories with > 0 hours for cleaner tooltips, or we can just keep them all.
      // Recharts handles missing keys fine.
      Object.keys(catBreakdownPoint).forEach(k => {
        if (k !== 'date') catBreakdownPoint[k] = parseFloat(catBreakdownPoint[k].toFixed(2));
      });
      categoryBreakdown.push(catBreakdownPoint);

      productiveVsUnproductive.push({
        date: formattedDate,
        productive: parseFloat(prodHours.toFixed(2)),
        unproductive: parseFloat(unprodHours.toFixed(2)),
      });

      eisenhowerDistribution.push({
        date: formattedDate,
        do: parseFloat(doHours.toFixed(2)),
        schedule: parseFloat(scheduleHours.toFixed(2)),
        delegate: parseFloat(delegateHours.toFixed(2)),
        eliminate: parseFloat(eliminateHours.toFixed(2)),
      });
    }

    // Top Activities
    const topActivities = Object.keys(activityTotals)
      .map(name => ({ name, hours: parseFloat(activityTotals[name].toFixed(2)) }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10);

    return {
      weeklyTrend,
      monthlyTrend,
      categoryBreakdown,
      productiveVsUnproductive,
      eisenhowerDistribution,
      sleepTrend,
      topActivities
    };
  },
};
