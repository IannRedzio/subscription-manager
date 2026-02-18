import { prisma } from '../config/database.js';
import {
  CreateSubscriptionDTO,
  UpdateSubscriptionDTO,
  SubscriptionFilters,
  PaginationResult,
  Subscription,
  SubscriptionStats,
} from '../models/Subscription.js';

export class SubscriptionRepository {
  async findAll(
    userId: string,
    filters: SubscriptionFilters
  ): Promise<PaginationResult<Subscription>> {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      category,
      billingCycle,
      sortBy = 'nextBillingDate',
      sortOrder = 'asc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    if (billingCycle) {
      where.billingCycle = billingCycle;
    }

    const validSortFields = ['name', 'amount', 'nextBillingDate', 'createdAt', 'category'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'nextBillingDate';
    const order = sortOrder === 'desc' ? 'desc' : 'asc';

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: order },
      }),
      prisma.subscription.count({ where }),
    ]);

    return {
      data: subscriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(userId: string, id: string): Promise<Subscription | null> {
    return prisma.subscription.findFirst({
      where: { id, userId },
    });
  }

  async create(userId: string, data: CreateSubscriptionDTO): Promise<Subscription> {
    return prisma.subscription.create({
      data: {
        userId,
        name: data.name,
        description: data.description ?? null,
        category: data.category,
        amount: data.amount,
        currency: data.currency || 'USD',
        billingCycle: data.billingCycle,
        isTrial: data.isTrial ?? false,
        trialEndDate: data.trialEndDate ? new Date(data.trialEndDate) : null,
        nextBillingDate: new Date(data.nextBillingDate),
        lastBillingDate: data.lastBillingDate ? new Date(data.lastBillingDate) : null,
        status: data.status || 'ACTIVE',
        notes: data.notes ?? null,
      },
    });
  }

  async update(
    userId: string,
    id: string,
    data: UpdateSubscriptionDTO
  ): Promise<Subscription | null> {
    const subscription = await prisma.subscription.findFirst({ where: { id, userId } });
    if (!subscription) {
      return null;
    }

    return prisma.subscription.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description ?? undefined,
        category: data.category,
        amount: data.amount,
        currency: data.currency,
        billingCycle: data.billingCycle,
        isTrial: data.isTrial,
        trialEndDate: data.trialEndDate
          ? new Date(data.trialEndDate)
          : data.trialEndDate === null
            ? null
            : undefined,
        nextBillingDate: data.nextBillingDate ? new Date(data.nextBillingDate) : undefined,
        lastBillingDate: data.lastBillingDate
          ? new Date(data.lastBillingDate)
          : data.lastBillingDate === null
            ? null
            : undefined,
        status: data.status,
        notes: data.notes ?? undefined,
      },
    });
  }

  async delete(userId: string, id: string): Promise<boolean> {
    const subscription = await prisma.subscription.findFirst({ where: { id, userId } });
    if (!subscription) {
      return false;
    }

    await prisma.subscription.delete({ where: { id } });
    return true;
  }

  async getStats(userId: string): Promise<SubscriptionStats> {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId, status: 'ACTIVE' },
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

    const byCategoryMap = subscriptions.reduce(
      (acc, s) => {
        if (!acc[s.category]) {
          acc[s.category] = { total: 0, count: 0 };
        }
        acc[s.category].total += s.amount;
        acc[s.category].count += 1;
        return acc;
      },
      {} as Record<string, { total: number; count: number }>
    );

    const byCategory = Object.entries(byCategoryMap).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
    }));

    return {
      totalMonthly,
      totalYearly,
      totalWeekly,
      byCategory,
      activeSubscriptions: subscriptions.length,
      cancelledSubscriptions: 0,
      pausedSubscriptions: 0,
    };
  }

  async getUpcoming(userId: string, days: number): Promise<Subscription[]> {
    const upperBound = new Date();
    upperBound.setDate(upperBound.getDate() + days);

    return prisma.subscription.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        nextBillingDate: {
          lte: upperBound,
        },
      },
      orderBy: { nextBillingDate: 'asc' },
    });
  }
}
