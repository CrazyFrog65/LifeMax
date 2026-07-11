import { Request, Response } from "express";
import { categoryService } from "../services/category.service.js";

export const categoryController = {
  getCategories: async (req: Request, res: Response) => {
    if (!req.user) throw new Error("User not found in request");

    const categories = await categoryService.getCategoriesForUser(req.user.id);
    res.json({ success: true, data: categories });
  },

  createCategory: async (req: Request, res: Response) => {
    if (!req.user) throw new Error("User not found in request");
    const { name, color, productive, icon, defaultUrgent, defaultImportant } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: "Category name is required" });
      return;
    }

    const category = await categoryService.createCategory(req.user.id, {
      name,
      color,
      productive: !!productive,
      icon,
      defaultUrgent: !!defaultUrgent,
      defaultImportant: !!defaultImportant,
    });

    res.json({ success: true, data: category });
  },

  updateCategory: async (req: Request, res: Response) => {
    if (!req.user) throw new Error("User not found in request");
    const { id } = req.params;
    const { name, color, productive, icon, defaultUrgent, defaultImportant } = req.body;

    if (name === "") {
      res.status(400).json({ success: false, message: "Category name cannot be empty" });
      return;
    }

    const category = await categoryService.updateCategory(id as string, req.user.id, {
      name,
      color,
      productive: productive !== undefined ? !!productive : undefined,
      icon,
      defaultUrgent: defaultUrgent !== undefined ? !!defaultUrgent : undefined,
      defaultImportant: defaultImportant !== undefined ? !!defaultImportant : undefined,
    });

    res.json({ success: true, data: category });
  },

  deleteCategory: async (req: Request, res: Response) => {
    if (!req.user) throw new Error("User not found in request");
    const { id } = req.params;

    const categories = await categoryService.getCategoriesForUser(req.user.id);
    if (categories.length <= 1) {
      res.status(400).json({ success: false, message: "Cannot delete the only remaining category." });
      return;
    }

    await categoryService.deleteCategory(id as string, req.user.id);
    res.json({ success: true, message: "Category deleted successfully" });
  },
};
