import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { Edit, Trash2, ArrowLeft, Calendar, DollarSign, Tag, Repeat } from 'lucide-react';
import { subscriptionsApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import type { Subscription } from '../types';
import { useTranslation } from 'react-i18next';

const SubscriptionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('es') ? es : enUS;
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await subscriptionsApi.getById(id);
      setSubscription(response.data);
      setError(null);
    } catch (err) {
      setError(t('messages.failedFetchSubscription'));
      console.error('Failed to fetch subscription:', err);
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handleEdit = useCallback(() => {
    navigate(`/subscriptions/${id}/edit`);
  }, [id, navigate, t]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    if (!confirm(t('messages.confirmDeleteSubscription'))) return;

    try {
      await subscriptionsApi.delete(id);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete subscription:', error);
    }
  }, [id, navigate]);

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

  if (error || !subscription) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error || t('messages.subscriptionNotFound')}
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400',
    PAUSED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400',
    TRIAL: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          {t('subscriptions.detailBack')}
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{subscription.name}</h1>
                {subscription.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{subscription.description}</p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[subscription.status]}`}>
                {t(`status.${subscription.status}`)}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('subscriptions.amount')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {subscription.currency} {subscription.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Repeat className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('subscriptions.billingCycle')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{t(`billingCycle.${subscription.billingCycle}`)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('subscriptions.nextBillingDate')}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {format(new Date(subscription.nextBillingDate), 'MMM dd, yyyy', { locale })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                  <Tag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('subscriptions.category')}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{subscription.category}</p>
                </div>
              </div>
            </div>

            {subscription.isTrial && subscription.trialEndDate && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  <strong>{t('subscriptions.trialPeriodLabel')}</strong> {t('subscriptions.trialPeriodEnds', {
                    date: format(new Date(subscription.trialEndDate), 'MMM dd, yyyy', { locale })
                  })}
                </p>
              </div>
            )}

            {subscription.lastBillingDate && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('subscriptions.lastBilled')}</p>
                <p className="text-gray-900 dark:text-white">
                  {format(new Date(subscription.lastBillingDate), 'MMM dd, yyyy', { locale })}
                </p>
              </div>
            )}

            {subscription.notes && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('subscriptions.notes')}</p>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">{subscription.notes}</p>
              </div>
            )}

            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={handleEdit} className="flex items-center gap-2">
                <Edit size={18} />
                {t('actions.edit')}
              </Button>
              <Button variant="danger" onClick={handleDelete} className="flex items-center gap-2">
                <Trash2 size={18} />
                {t('actions.delete')}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionDetail;
