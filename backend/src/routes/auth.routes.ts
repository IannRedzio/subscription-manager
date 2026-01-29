import { Router } from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/google', authController.googleAuth);
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  authController.googleCallback
);
router.get('/github', authController.githubAuth);
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: 'http://localhost:5173/login' }),
  authController.githubCallback
);
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getMe);

export default router;
