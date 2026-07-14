import prisma from "../config/database.js";

export const userRepository = {
  findByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findById: (id: string) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  create: (data: { email: string; passwordHash: string; name: string }) => {
    return prisma.user.create({
      data: {
        ...data,
        categories: {
          create: [
            { name: "Academic",          productive: true,  color: "#4A7AE0", icon: "school",            defaultUrgent: true,  defaultImportant: true },
            { name: "Work",              productive: true,  color: "#6C9EFF", icon: "work",              defaultUrgent: true,  defaultImportant: true },
            { name: "Creative",          productive: true,  color: "#58A6FF", icon: "brush",             defaultUrgent: false, defaultImportant: true },
            { name: "Gym",               productive: true,  color: "#3FB950", icon: "fitness_center",    defaultUrgent: false, defaultImportant: true },
            { name: "Daily Chores",      productive: true,  color: "#D29922", icon: "cleaning_services", defaultUrgent: true,  defaultImportant: false },
            { name: "Personal",          productive: true,  color: "#A78BFA", icon: "person",            defaultUrgent: false, defaultImportant: true },
            { name: "Food",              productive: false, color: "#F85149", icon: "restaurant",        defaultUrgent: false, defaultImportant: true },
            { name: "Sleep",             productive: false, color: "#A0B2C6", icon: "bedtime",           defaultUrgent: false, defaultImportant: false },
            { name: "Nothing Specific",  productive: false, color: "#8B949E", icon: "do_not_disturb",    defaultUrgent: false, defaultImportant: false },
            { name: "None",              productive: false, color: "#545D68", icon: "remove",            defaultUrgent: false, defaultImportant: false },
          ]
        }
      }
    });
  },
};
