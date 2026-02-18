import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { subscriptionsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import MonthlyChart from '../components/MonthlyChart';
import CategoryChart from '../components/CategoryChart';
import type { Subscription, SubscriptionStats } from '../types';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CalendarClock, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('es') ? es : enUS;

  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [upcoming, setUpcoming] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [allSubsResponse, statsResponse, upcomingResponse] = await Promise.all([
        subscriptionsApi.getAll({ limit: 1000, page: 1 }),
        subscriptionsApi.getStats(),
        subscriptionsApi.getUpcoming(),
      ]);

      setAllSubscriptions(allSubsResponse.data?.data || []);
      setStats(statsResponse.data);
      setUpcoming(upcomingResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeSubscriptions = useMemo(
    () => (allSubscriptions || []).filter((s) => s.status === 'ACTIVE'),
    [allSubscriptions]
  );

  const totalMonthly = useMemo(
    () =>
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

  const todayFormatted = format(new Date(), 'EEEE, MMMM d', { locale });

  if (loading && allSubscriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section */}
        <div className="mb-10 animate-slide-up">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400 capitalize">
              {todayFormatted}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t('dashboard.greeting')}
            {user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="animate-slide-up delay-1">
            <StatsCard
              title={t('dashboard.stats.monthlySpending')}
              value={`$${totalMonthly.toFixed(2)}`}
              icon="dollar"
            />
          </div>
          <div className="animate-slide-up delay-2">
            <StatsCard
              title={t('dashboard.stats.activeSubscriptions')}
              value={activeSubscriptions.length}
              icon="calendar"
            />
          </div>
          <div className="animate-slide-up delay-3">
            <StatsCard
              title={t('dashboard.stats.totalYearly')}
              value={`$${(stats?.totalYearly || 0).toFixed(2)}`}
              icon="trending"
            />
          </div>
          <div className="animate-slide-up delay-4">
            <StatsCard
              title={t('dashboard.stats.upcoming7Days')}
              value={next7Days.length}
              icon="alert"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 animate-slide-up delay-5">
          <MonthlyChart subscriptions={allSubscriptions} />
          {stats && <CategoryChart stats={stats} />}
        </div>

        {/* Upcoming Billing */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
              <CalendarClock className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.upcomingTitle')}
            </h2>
          </div>
          {next7Days.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {next7Days.map((sub, index) => (
                <div
                  key={sub.id}
                  onClick={() => navigate(`/subscriptions/${sub.id}`)}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-violet-500 dark:border-violet-400 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {sub.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {format(new Date(sub.nextBillingDate), 'MMM dd, yyyy', { locale })}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${sub.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">{t('dashboard.noUpcoming')}</p>
            </div>
          )}
        </div>

        {/* CTA to Subscriptions */}
        <div className="animate-fade-in">
          <Link
            to="/subscriptions"
            className="group flex items-center justify-between bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <div>
              <h3 className="text-xl font-bold text-white">{t('dashboard.viewAll')}</h3>
              <p className="text-white/70 text-sm mt-1">{t('dashboard.allSubscriptions')}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
