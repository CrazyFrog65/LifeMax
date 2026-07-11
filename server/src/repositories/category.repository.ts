import prisma from "../config/database.js";

export const categoryRepository = {
  findAllByUserId: (userId: string) => {
    return prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  },

  findById: (id: string) => {
    return prisma.category.findUnique({
      where: { id },
    });
  },

  create: (userId: string, data: any) => {
    return prisma.category.create({
      data: {
        ...data,
        userId,
      },
    });
  },

  update: (id: string, userId: string, data: any) => {
    return prisma.category.update({
      where: { id, userId },
      data,
    });
  },

  delete: (id: string, userId: string) => {
    return prisma.category.delete({
      where: { id, userId },
    });
  },
};
