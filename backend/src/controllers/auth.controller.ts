import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from '../config/passport.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

export const googleCallback = (req: Request, res: Response) => {
  const user = req.user as any;
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || '',
    { expiresIn: '7d' }
  );

  res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
};

export const githubAuth = passport.authenticate('github', {
  scope: ['user:email'],
});

export const githubCallback = (req: Request, res: Response) => {
  const user = req.user as any;
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || '',
    { expiresIn: '7d' }
  );

  res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
};

export const logout = (req: AuthRequest, res: Response) => {
  res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
