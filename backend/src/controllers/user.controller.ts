import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service.js';

export const getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.getById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.updateRole(req.params.id, req.body?.role);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await userService.remove(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
