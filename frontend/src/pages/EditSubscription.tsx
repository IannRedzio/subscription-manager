import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { subscriptionsApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SubscriptionForm from '../components/SubscriptionForm';
import type { Subscription, SubscriptionFormData } from '../types';
import { useTranslation } from 'react-i18next';

const EditSubscription = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
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

  const handleSubmit = useCallback(async (data: SubscriptionFormData) => {
    if (!id) return;

    try {
      await subscriptionsApi.update(id, data);
      navigate('/');
    } catch (error) {
      console.error('Failed to update subscription:', error);
      throw error;
    }
  }, [id, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('subscriptions.editTitle')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('subscriptions.editSubtitle')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <SubscriptionForm subscription={subscription} onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditSubscription;
