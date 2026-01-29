import { PrismaClient as PrismaClientClass } from './generated/client.js';

let prismaInstance: any = null;

export const getPrismaClient = () => {
  if (!prismaInstance) {
    prismaInstance = new (PrismaClientClass as any)();
  }
  return prismaInstance;
};

export const prisma = getPrismaClient();
