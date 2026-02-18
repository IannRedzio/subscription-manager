import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionsApi, categoriesApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SubscriptionList from '../components/SubscriptionList';
import SearchInput from '../components/SearchInput';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import type { Subscription, SubscriptionFilters, PaginationMeta, Category } from '../types';
import { useTranslation } from 'react-i18next';

const Subscriptions = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<SubscriptionFilters>({
    sortBy: 'nextBillingDate',
    sortOrder: 'asc',
    page: 1,
    limit: 10,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subsResponse, categoriesResponse] = await Promise.all([
        subscriptionsApi.getAll(filters),
        categoriesApi.getAll(),
      ]);

      setSubscriptions(subsResponse.data?.data || []);
      setPagination(
        subsResponse.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
      );
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = useCallback(
    (id: string) => {
      navigate(`/subscriptions/${id}/edit`);
    },
    [navigate]
  );

  const handleView = useCallback(
    (id: string) => {
      navigate(`/subscriptions/${id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm(t('messages.confirmDeleteSubscription'))) return;

      try {
        await subscriptionsApi.delete(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete subscription:', error);
      }
    },
    [fetchData, t]
  );

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value || undefined, page: 1 }));
  }, []);

  const handleFilterChange = useCallback((newFilters: SubscriptionFilters) => {
    setFilters((prev) => ({ ...newFilters, search: prev.search, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('subscriptionsPage.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('subscriptionsPage.subtitle')}</p>
        </div>

        <div className="animate-slide-up delay-1">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div className="w-full lg:w-80">
              <SearchInput
                value={filters.search || ''}
                onChange={handleSearchChange}
                placeholder={t('search.subscriptionsPlaceholder')}
              />
            </div>
          </div>

          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categories}
          />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <SubscriptionList
              subscriptions={subscriptions}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Subscriptions;
