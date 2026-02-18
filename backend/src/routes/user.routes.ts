import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, adminMiddleware, userController.getUsers);
router.get('/:id', authMiddleware, adminMiddleware, userController.getUserById);
router.put('/:id/role', authMiddleware, adminMiddleware, userController.updateUserRole);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

export default router;
