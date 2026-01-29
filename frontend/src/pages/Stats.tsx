import { useState, useEffect, useCallback } from 'react';
import { subscriptionsApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MonthlyChart from '../components/MonthlyChart';
import CategoryChart from '../components/CategoryChart';
import StatsCard from '../components/StatsCard';
import type { Subscription, SubscriptionStats } from '../types';

const Stats = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subsResponse, statsResponse] = await Promise.all([
        subscriptionsApi.getAll(),
        subscriptionsApi.getStats(),
      ]);

      setSubscriptions(subsResponse.data);
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Failed to load statistics
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
          <p className="text-gray-600 mt-1">Detailed breakdown of your subscription spending</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Monthly Spending"
            value={`$${stats.totalMonthly.toFixed(2)}`}
            icon="dollar"
          />
          <StatsCard
            title="Yearly Spending"
            value={`$${stats.totalYearly.toFixed(2)}`}
            icon="trending"
          />
          <StatsCard
            title="Weekly Spending"
            value={`$${stats.totalWeekly.toFixed(2)}`}
            icon="calendar"
          />
          <StatsCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions}
            icon="dollar"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlyChart subscriptions={subscriptions} />
          <CategoryChart stats={stats} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Spending by Category</h2>
          <div className="space-y-3">
            {stats.byCategory.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{cat.category}</p>
                  <p className="text-sm text-gray-600">{cat.count} subscription(s)</p>
                </div>
                <p className="text-lg font-semibold text-gray-900">${cat.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <StatsCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions}
            icon="calendar"
          />
          <StatsCard
            title="Cancelled Subscriptions"
            value={stats.cancelledSubscriptions}
            icon="alert"
          />
          <StatsCard
            title="Paused Subscriptions"
            value={stats.pausedSubscriptions}
            icon="alert"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Stats;
