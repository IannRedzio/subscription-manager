import { prisma } from '../config/database.js';
import { User, UpdateUserRoleDTO } from '../models/User.js';

export class UserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async create(data: {
    email: string;
    name?: string | null;
    avatar?: string | null;
    role?: 'ADMIN' | 'USER';
  }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name ?? null,
        avatar: data.avatar ?? null,
        role: data.role ?? 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateRole(id: string, data: UpdateUserRoleDTO): Promise<User | null> {
    try {
      return await prisma.user.update({
        where: { id },
        data: { role: data.role },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          createdAt: true,
        },
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
