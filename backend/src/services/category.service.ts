import { CategoryRepository } from '../repositories/category.repository.js';
import { Category, CreateCategoryDTO } from '../models/Category.js';
import { ValidationError } from '../utils/errors.js';

const categoryRepository = new CategoryRepository();

export const getAll = async (): Promise<Category[]> => {
  return categoryRepository.findAll();
};

export const create = async (data: CreateCategoryDTO): Promise<Category> => {
  if (!data.name || data.name.trim().length === 0) {
    throw new ValidationError('Category name is required');
  }

  return categoryRepository.create({
    name: data.name.trim(),
    color: data.color ?? null,
    icon: data.icon ?? null,
  });
};
