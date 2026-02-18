export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  category: string;
  amount: number;
  currency: string;
  billingCycle: 'MONTHLY' | 'YEARLY' | 'WEEKLY';
  isTrial: boolean;
  trialEndDate?: string | null;
  nextBillingDate: string;
  lastBillingDate?: string | null;
  status: 'ACTIVE' | 'CANCELLED' | 'PAUSED' | 'TRIAL';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string | null;
  icon?: string | null;
  createdAt: string;
}

export interface SubscriptionStats {
  totalMonthly: number;
  totalYearly: number;
  totalWeekly: number;
  byCategory: {
    category: string;
    total: number;
    count: number;
  }[];
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  pausedSubscriptions: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

export interface SubscriptionFormData {
  name: string;
  description?: string;
  category: string;
  amount: number;
  currency: string;
  billingCycle: 'MONTHLY' | 'YEARLY' | 'WEEKLY';
  isTrial: boolean;
  trialEndDate?: string;
  nextBillingDate: string;
  notes?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface SubscriptionFilters {
  search?: string;
  status?: string;
  category?: string;
  billingCycle?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
