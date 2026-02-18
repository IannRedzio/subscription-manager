import axios from 'axios';
import type { User, Subscription, SubscriptionStats, Category, PaginatedResponse, SubscriptionFilters } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  getMe: () => api.get<User>('/auth/me'),
  logout: () => api.post('/auth/logout'),
  googleLogin: () => window.location.href = `${API_BASE_URL}/auth/google`,
  githubLogin: () => window.location.href = `${API_BASE_URL}/auth/github`,
};

export const subscriptionsApi = {
  getAll: (filters?: SubscriptionFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.billingCycle) params.append('billingCycle', filters.billingCycle);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    return api.get<PaginatedResponse<Subscription>>(`/subscriptions${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: string) => api.get<Subscription>(`/subscriptions/${id}`),
  create: (data: Partial<Subscription>) => api.post<Subscription>('/subscriptions', data),
  update: (id: string, data: Partial<Subscription>) => api.put<Subscription>(`/subscriptions/${id}`, data),
  delete: (id: string) => api.delete(`/subscriptions/${id}`),
  getStats: () => api.get<SubscriptionStats>('/subscriptions/stats'),
  getUpcoming: () => api.get<Subscription[]>('/subscriptions/upcoming'),
};

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  create: (data: Partial<Category>) => api.post<Category>('/categories', data),
};

export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  updateRole: (id: string, role: 'ADMIN' | 'USER') => api.put<User>(`/users/${id}/role`, { role }),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export default api;
