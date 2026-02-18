import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service.js';

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await categoryService.getAll();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};
