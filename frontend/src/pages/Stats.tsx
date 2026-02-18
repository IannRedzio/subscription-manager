import { useState, useEffect, useCallback } from 'react';
import { subscriptionsApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MonthlyChart from '../components/MonthlyChart';
import CategoryChart from '../components/CategoryChart';
import StatsCard from '../components/StatsCard';
import type { Subscription, SubscriptionStats } from '../types';
import { useTranslation } from 'react-i18next';

const Stats = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subsResponse, statsResponse] = await Promise.all([
        subscriptionsApi.getAll({ limit: 1000 }),
        subscriptionsApi.getStats(),
      ]);

      setSubscriptions(subsResponse.data.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {t('stats.failedToLoad')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('stats.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('stats.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title={t('stats.monthlySpending')}
            value={`$${(stats?.totalMonthly || 0).toFixed(2)}`}
            icon="dollar"
          />
          <StatsCard
            title={t('stats.yearlySpending')}
            value={`$${(stats?.totalYearly || 0).toFixed(2)}`}
            icon="trending"
          />
          <StatsCard
            title={t('stats.weeklySpending')}
            value={`$${(stats?.totalWeekly || 0).toFixed(2)}`}
            icon="calendar"
          />
          <StatsCard
            title={t('stats.activeSubscriptions')}
            value={stats?.activeSubscriptions || 0}
            icon="dollar"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlyChart subscriptions={subscriptions} />
          <CategoryChart stats={stats} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('stats.spendingByCategory')}</h2>
          <div className="space-y-3">
            {(stats?.byCategory || []).map((cat) => (
              <div key={cat.category} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{cat.category}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('charts.subscriptionsCount', { count: cat.count })}</p>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">${cat.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <StatsCard
            title={t('stats.activeSubscriptions')}
            value={stats?.activeSubscriptions || 0}
            icon="calendar"
          />
          <StatsCard
            title={t('stats.cancelledSubscriptions')}
            value={stats?.cancelledSubscriptions || 0}
            icon="alert"
          />
          <StatsCard
            title={t('stats.pausedSubscriptions')}
            value={stats?.pausedSubscriptions || 0}
            icon="alert"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Stats;
