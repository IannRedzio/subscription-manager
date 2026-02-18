import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { subscriptionsApi, categoriesApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SubscriptionList from '../components/SubscriptionList';
import StatsCard from '../components/StatsCard';
import MonthlyChart from '../components/MonthlyChart';
import CategoryChart from '../components/CategoryChart';
import SearchInput from '../components/SearchInput';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import type { Subscription, SubscriptionStats, SubscriptionFilters, PaginationMeta, Category } from '../types';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('es') ? es : enUS;

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [upcoming, setUpcoming] = useState<Subscription[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const [filters, setFilters] = useState<SubscriptionFilters>({
    sortBy: 'nextBillingDate',
    sortOrder: 'asc',
    page: 1,
    limit: 10,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subsResponse, allSubsResponse, statsResponse, upcomingResponse, categoriesResponse] = await Promise.all([
        subscriptionsApi.getAll(filters),
        subscriptionsApi.getAll({ ...filters, limit: 1000, page: 1 }),
        subscriptionsApi.getStats(),
        subscriptionsApi.getUpcoming(),
        categoriesApi.getAll(),
      ]);

      setSubscriptions(subsResponse.data?.data || []);
      setPagination(subsResponse.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
      setAllSubscriptions(allSubsResponse.data?.data || []);
      setStats(statsResponse.data);
      setUpcoming(upcomingResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = useCallback((id: string) => {
    navigate(`/subscriptions/${id}/edit`);
  }, [navigate]);

  const handleView = useCallback((id: string) => {
    navigate(`/subscriptions/${id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm(t('messages.confirmDeleteSubscription'))) return;

    try {
      await subscriptionsApi.delete(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete subscription:', error);
    }
  }, [fetchData, t]);

  const handleSearchChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value || undefined, page: 1 }));
  }, []);

  const handleFilterChange = useCallback((newFilters: SubscriptionFilters) => {
    setFilters(prev => ({ ...newFilters, search: prev.search, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const activeSubscriptions = useMemo(() =>
    (allSubscriptions || []).filter((s) => s.status === 'ACTIVE'),
    [allSubscriptions]
  );

  const totalMonthly = useMemo(() =>
    (activeSubscriptions || [])
      .filter((s) => s.billingCycle === 'MONTHLY')
      .reduce((sum, s) => sum + s.amount, 0),
    [activeSubscriptions]
  );

  const next7Days = useMemo(() => {
    const today = new Date();
    const weekLater = addDays(today, 7);
    return (upcoming || []).filter((sub) => {
      const billingDate = new Date(sub.nextBillingDate);
      return billingDate >= today && billingDate <= weekLater;
    });
  }, [upcoming]);

  if (loading && subscriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('dashboard.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title={t('dashboard.stats.monthlySpending')}
            value={`$${totalMonthly.toFixed(2)}`}
            icon="dollar"
          />
          <StatsCard
            title={t('dashboard.stats.activeSubscriptions')}
            value={activeSubscriptions.length}
            icon="calendar"
          />
          <StatsCard
            title={t('dashboard.stats.totalYearly')}
            value={`$${(stats?.totalYearly || 0).toFixed(2)}`}
            icon="trending"
          />
          <StatsCard
            title={t('dashboard.stats.upcoming7Days')}
            value={next7Days.length}
            icon="alert"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlyChart subscriptions={allSubscriptions} />
          {stats && <CategoryChart stats={stats} />}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('dashboard.upcomingTitle')}</h2>
          {next7Days.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {next7Days.map((sub) => (
                <div key={sub.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{sub.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {format(new Date(sub.nextBillingDate), 'MMM dd, yyyy', { locale })}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                    ${sub.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400">
              {t('dashboard.noUpcoming')}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard.allSubscriptions')}</h2>
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

export default Dashboard;
