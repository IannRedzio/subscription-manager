import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { subscriptionsApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SubscriptionList from '../components/SubscriptionList';
import StatsCard from '../components/StatsCard';
import MonthlyChart from '../components/MonthlyChart';
import CategoryChart from '../components/CategoryChart';
import type { Subscription, SubscriptionStats } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [upcoming, setUpcoming] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subsResponse, statsResponse, upcomingResponse] = await Promise.all([
        subscriptionsApi.getAll(),
        subscriptionsApi.getStats(),
        subscriptionsApi.getUpcoming(),
      ]);

      setSubscriptions(subsResponse.data);
      setStats(statsResponse.data);
      setUpcoming(upcomingResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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
    if (!confirm('Are you sure you want to delete this subscription?')) return;

    try {
      await subscriptionsApi.delete(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete subscription:', error);
    }
  }, [fetchData]);

  const activeSubscriptions = useMemo(() => 
    subscriptions.filter((s) => s.status === 'ACTIVE'), 
    [subscriptions]
  );

  const totalMonthly = useMemo(() => 
    activeSubscriptions
      .filter((s) => s.billingCycle === 'MONTHLY')
      .reduce((sum, s) => sum + s.amount, 0),
    [activeSubscriptions]
  );

  const next7Days = useMemo(() => {
    const today = new Date();
    const weekLater = addDays(today, 7);
    return upcoming.filter((sub) => {
      const billingDate = new Date(sub.nextBillingDate);
      return billingDate >= today && billingDate <= weekLater;
    });
  }, [upcoming]);

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your subscriptions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Monthly Spending"
            value={`$${totalMonthly.toFixed(2)}`}
            icon="dollar"
          />
          <StatsCard
            title="Active Subscriptions"
            value={activeSubscriptions.length}
            icon="calendar"
          />
          <StatsCard
            title="Total Yearly"
            value={`$${(stats?.totalYearly || 0).toFixed(2)}`}
            icon="trending"
          />
          <StatsCard
            title="Upcoming (7 days)"
            value={next7Days.length}
            icon="alert"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlyChart subscriptions={subscriptions} />
          {stats && <CategoryChart stats={stats} />}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Billing (7 Days)</h2>
          {next7Days.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {next7Days.map((sub) => (
                <div key={sub.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-gray-900">{sub.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(new Date(sub.nextBillingDate), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    ${sub.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No upcoming billing in the next 7 days
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Subscriptions</h2>
          <SubscriptionList
            subscriptions={subscriptions}
            loading={false}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
