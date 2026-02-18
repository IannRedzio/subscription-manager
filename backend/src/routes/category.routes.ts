import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', categoryController.getCategories);
router.post('/', authMiddleware, adminMiddleware, categoryController.createCategory);

export default router;
