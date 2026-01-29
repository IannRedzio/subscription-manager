import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware.js';

const prisma = new PrismaClient();

export const getSubscriptions = async (req: AuthRequest, res: Response) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user?.id },
      orderBy: { nextBillingDate: 'asc' },
    });

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSubscriptionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.subscription.findFirst({
      where: { id, userId: req.user?.id },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      category,
      amount,
      currency,
      billingCycle,
      isTrial,
      trialEndDate,
      nextBillingDate,
      lastBillingDate,
      status,
      notes,
    } = req.body;

    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user!.id,
        name,
        description,
        category,
        amount,
        currency: currency || 'USD',
        billingCycle,
        isTrial: isTrial || false,
        trialEndDate: trialEndDate ? new Date(trialEndDate) : null,
        nextBillingDate: new Date(nextBillingDate),
        lastBillingDate: lastBillingDate ? new Date(lastBillingDate) : null,
        status: status || 'ACTIVE',
        notes,
      },
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      amount,
      currency,
      billingCycle,
      isTrial,
      trialEndDate,
      nextBillingDate,
      lastBillingDate,
      status,
      notes,
    } = req.body;

    const subscription = await prisma.subscription.findFirst({
      where: { id, userId: req.user?.id },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        name,
        description,
        category,
        amount,
        currency,
        billingCycle,
        isTrial,
        trialEndDate: trialEndDate ? new Date(trialEndDate) : null,
        nextBillingDate: nextBillingDate ? new Date(nextBillingDate) : undefined,
        lastBillingDate: lastBillingDate ? new Date(lastBillingDate) : null,
        status,
        notes,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.subscription.findFirst({
      where: { id, userId: req.user?.id },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    await prisma.subscription.delete({ where: { id } });

    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSubscriptionStats = async (req: AuthRequest, res: Response) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user?.id, status: 'ACTIVE' },
    });

    const totalMonthly = subscriptions
      .filter((s) => s.billingCycle === 'MONTHLY')
      .reduce((sum, s) => sum + s.amount, 0);

    const totalYearly = subscriptions
      .filter((s) => s.billingCycle === 'YEARLY')
      .reduce((sum, s) => sum + s.amount, 0);

    const totalWeekly = subscriptions
      .filter((s) => s.billingCycle === 'WEEKLY')
      .reduce((sum, s) => sum + s.amount, 0);

    const byCategoryMap = subscriptions.reduce((acc, s) => {
      if (!acc[s.category]) {
        acc[s.category] = { total: 0, count: 0 };
      }
      acc[s.category].total += s.amount;
      acc[s.category].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const byCategory = Object.entries(byCategoryMap).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
    }));

    res.json({
      totalMonthly,
      totalYearly,
      totalWeekly,
      byCategory,
      activeSubscriptions: subscriptions.length,
      cancelledSubscriptions: 0,
      pausedSubscriptions: 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUpcomingSubscriptions = async (req: AuthRequest, res: Response) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: req.user?.id,
        status: 'ACTIVE',
        nextBillingDate: {
          lte: thirtyDaysFromNow,
        },
      },
      orderBy: { nextBillingDate: 'asc' },
    });

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
