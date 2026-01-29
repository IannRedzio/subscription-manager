import { Router } from 'express';
import * as categoryController from '../controllers/categories.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();

router.get('/', categoryController.getCategories);
router.post('/', authMiddleware, adminMiddleware, categoryController.createCategory);

export default router;
