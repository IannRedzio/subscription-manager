import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import * as authService from '../services/auth.service.js';

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

export const googleCallback = (req: Request, res: Response) => {
  const user = req.user as any;
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || '', {
    expiresIn: '7d',
  });

  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
};

export const githubAuth = passport.authenticate('github', {
  scope: ['user:email'],
});

export const githubCallback = (req: Request, res: Response) => {
  const user = req.user as any;
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || '', {
    expiresIn: '7d',
  });

  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
};

export const logout = (_req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await authService.getMe(req.user as any);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
