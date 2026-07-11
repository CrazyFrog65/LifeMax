import { categoryRepository } from "../repositories/category.repository.js";

export const categoryService = {
  getCategoriesForUser: async (userId: string) => {
    return categoryRepository.findAllByUserId(userId);
  },

  getCategoryById: async (id: string, userId: string) => {
    const category = await categoryRepository.findById(id);
    if (!category || category.userId !== userId) {
      throw new Error("Category not found or unauthorized");
    }
    return category;
  },

  createCategory: async (userId: string, data: any) => {
    return categoryRepository.create(userId, data);
  },

  updateCategory: async (id: string, userId: string, data: any) => {
    await categoryService.getCategoryById(id, userId);
    return categoryRepository.update(id, userId, data);
  },

  deleteCategory: async (id: string, userId: string) => {
    await categoryService.getCategoryById(id, userId);
    return categoryRepository.delete(id, userId);
  },
};
