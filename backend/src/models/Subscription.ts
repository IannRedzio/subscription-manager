// Value objects
export const billingCycles = ['MONTHLY', 'YEARLY', 'WEEKLY'] as const;
export type BillingCycle = (typeof billingCycles)[number];

export const subscriptionStatuses = ['ACTIVE', 'CANCELLED', 'PAUSED', 'TRIAL'] as const;
export type SubscriptionStatus = (typeof subscriptionStatuses)[number];

// Entity
export interface Subscription {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  category: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  isTrial: boolean;
  trialEndDate?: Date | null;
  nextBillingDate: Date;
  lastBillingDate?: Date | null;
  status: SubscriptionStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs
export interface CreateSubscriptionDTO {
  name: string;
  description?: string | null;
  category: string;
  amount: number;
  currency?: string;
  billingCycle: BillingCycle;
  isTrial?: boolean;
  trialEndDate?: string | Date | null;
  nextBillingDate: string | Date;
  lastBillingDate?: string | Date | null;
  status?: SubscriptionStatus;
  notes?: string | null;
}

export interface UpdateSubscriptionDTO {
  name?: string;
  description?: string | null;
  category?: string;
  amount?: number;
  currency?: string;
  billingCycle?: BillingCycle;
  isTrial?: boolean;
  trialEndDate?: string | Date | null;
  nextBillingDate?: string | Date | null;
  lastBillingDate?: string | Date | null;
  status?: SubscriptionStatus;
  notes?: string | null;
}

export interface SubscriptionFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: SubscriptionStatus;
  category?: string;
  billingCycle?: BillingCycle;
  sortBy?: 'name' | 'amount' | 'nextBillingDate' | 'createdAt' | 'category';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SubscriptionStats {
  totalMonthly: number;
  totalYearly: number;
  totalWeekly: number;
  byCategory: Array<{ category: string; total: number; count: number }>;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  pausedSubscriptions: number;
}
