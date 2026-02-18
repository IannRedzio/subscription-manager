import { Request, Response, NextFunction } from 'express';
import * as subscriptionService from '../services/subscription.service.js';
import { UnauthorizedError } from '../utils/errors.js';

const getUserId = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }
  return userId;
};

export const getSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const result = await subscriptionService.getAll(userId, {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      search: req.query.search ? String(req.query.search) : undefined,
      status: req.query.status ? (String(req.query.status) as any) : undefined,
      category: req.query.category ? String(req.query.category) : undefined,
      billingCycle: req.query.billingCycle ? (String(req.query.billingCycle) as any) : undefined,
      sortBy: req.query.sortBy ? (String(req.query.sortBy) as any) : undefined,
      sortOrder: req.query.sortOrder ? (String(req.query.sortOrder) as any) : undefined,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const subscription = await subscriptionService.getById(userId, req.params.id);
    res.json(subscription);
  } catch (error) {
    next(error);
  }
};

export const createSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const subscription = await subscriptionService.create(userId, req.body);
    res.status(201).json(subscription);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const subscription = await subscriptionService.update(userId, req.params.id, req.body);
    res.json(subscription);
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    await subscriptionService.remove(userId, req.params.id);
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const stats = await subscriptionService.getStats(userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getUpcomingSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const days = req.query.days ? Number(req.query.days) : 30;
    const subscriptions = await subscriptionService.getUpcoming(userId, days);
    res.json(subscriptions);
  } catch (error) {
    next(error);
  }
};
