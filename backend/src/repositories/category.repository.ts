import { prisma } from '../config/database.js';
import { Category, CreateCategoryDTO } from '../models/Category.js';

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany();
  }

  async create(data: CreateCategoryDTO): Promise<Category> {
    return prisma.category.create({
      data: {
        name: data.name,
        color: data.color ?? null,
        icon: data.icon ?? null,
      },
    });
  }
}
