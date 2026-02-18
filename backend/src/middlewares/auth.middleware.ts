import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      avatar: user.avatar || undefined,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  next();
};
