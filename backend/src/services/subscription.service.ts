import { SubscriptionRepository } from '../repositories/subscription.repository.js';
import {
  Subscription,
  CreateSubscriptionDTO,
  UpdateSubscriptionDTO,
  SubscriptionFilters,
  PaginationResult,
  SubscriptionStats,
  billingCycles,
  subscriptionStatuses,
} from '../models/Subscription.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

const subscriptionRepository = new SubscriptionRepository();

export const getAll = async (
  userId: string,
  filters: SubscriptionFilters
): Promise<PaginationResult<Subscription>> => {
  if (!userId) {
    throw new ValidationError('User id is required');
  }

  const page = Number.isFinite(filters.page) ? Number(filters.page) : 1;
  const limit = Number.isFinite(filters.limit) ? Number(filters.limit) : 10;
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? limit : 10;

  if (filters.billingCycle && !billingCycles.includes(filters.billingCycle)) {
    throw new ValidationError('Invalid billing cycle');
  }

  if (filters.status && !subscriptionStatuses.includes(filters.status)) {
    throw new ValidationError('Invalid subscription status');
  }

  return subscriptionRepository.findAll(userId, {
    ...filters,
    page: safePage,
    limit: safeLimit,
  });
};

export const getById = async (userId: string, id: string): Promise<Subscription> => {
  if (!userId) {
    throw new ValidationError('User id is required');
  }

  if (!id) {
    throw new ValidationError('Subscription id is required');
  }

  const subscription = await subscriptionRepository.findById(userId, id);

  if (!subscription) {
    throw new NotFoundError('Subscription', id);
  }

  return subscription;
};

export const create = async (
  userId: string,
  data: CreateSubscriptionDTO
): Promise<Subscription> => {
  if (!userId) {
    throw new ValidationError('User id is required');
  }

  if (!data.name || data.name.trim().length === 0) {
    throw new ValidationError('Name is required');
  }

  if (!data.category || data.category.trim().length === 0) {
    throw new ValidationError('Category is required');
  }

  if (typeof data.amount !== 'number' || data.amount <= 0) {
    throw new ValidationError('Amount must be a positive number');
  }

  if (!data.billingCycle || !billingCycles.includes(data.billingCycle)) {
    throw new ValidationError('Invalid billing cycle');
  }

  if (!data.nextBillingDate) {
    throw new ValidationError('Next billing date is required');
  }

  if (data.status && !subscriptionStatuses.includes(data.status)) {
    throw new ValidationError('Invalid subscription status');
  }

  return subscriptionRepository.create(userId, {
    ...data,
    name: data.name.trim(),
    category: data.category.trim(),
    currency: data.currency || 'USD',
    isTrial: data.isTrial ?? false,
    status: data.status ?? 'ACTIVE',
    description: data.description ?? null,
    notes: data.notes ?? null,
    trialEndDate: data.trialEndDate ?? null,
    lastBillingDate: data.lastBillingDate ?? null,
  });
};

export const update = async (
  userId: string,
  id: string,
  data: UpdateSubscriptionDTO
): Promise<Subscription> => {
  if (!userId) {
    throw new ValidationError('User id is required');
  }

  if (!id) {
    throw new ValidationError('Subscription id is required');
  }

  if (data.amount !== undefined && (typeof data.amount !== 'number' || data.amount <= 0)) {
    throw new ValidationError('Amount must be a positive number');
  }

  if (data.billingCycle && !billingCycles.includes(data.billingCycle)) {
    throw new ValidationError('Invalid billing cycle');
  }

  if (data.status && !subscriptionStatuses.includes(data.status)) {
    throw new ValidationError('Invalid subscription status');
  }

  const updated = await subscriptionRepository.update(userId, id, {
    ...data,
    name: data.name?.trim(),
    category: data.category?.trim(),
  });

  if (!updated) {
    throw new NotFoundError('Subscription', id);
  }

  return updated;
};

export const remove = async (userId: string, id: string): Promise<void> => {
  if (!userId) {
    throw new ValidationError('User id is required');
  }

  if (!id) {
    throw new ValidationError('Subscription id is required');
  }

  const deleted = await subscriptionRepository.delete(userId, id);

  if (!deleted) {
    throw new NotFoundError('Subscription', id);
  }
};

export const getStats = async (userId: string): Promise<SubscriptionStats> => {
  if (!userId) {
    throw new ValidationError('User id is required');
  }

  return subscriptionRepository.getStats(userId);
};

export const getUpcoming = async (userId: string, days = 30): Promise<Subscription[]> => {
  if (!userId) {
    throw new ValidationError('User id is required');
  }

  const safeDays = Number.isFinite(days) && days > 0 ? days : 30;
  return subscriptionRepository.getUpcoming(userId, safeDays);
};
