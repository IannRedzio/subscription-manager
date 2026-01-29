import { Router } from 'express';
import * as subscriptionController from '../controllers/subscriptions.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, subscriptionController.getSubscriptions);
router.get('/stats', authMiddleware, subscriptionController.getSubscriptionStats);
router.get('/upcoming', authMiddleware, subscriptionController.getUpcomingSubscriptions);
router.get('/:id', authMiddleware, subscriptionController.getSubscriptionById);
router.post('/', authMiddleware, subscriptionController.createSubscription);
router.put('/:id', authMiddleware, subscriptionController.updateSubscription);
router.delete('/:id', authMiddleware, subscriptionController.deleteSubscription);

export default router;
