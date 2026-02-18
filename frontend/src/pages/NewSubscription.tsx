import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionsApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SubscriptionForm from '../components/SubscriptionForm';
import type { SubscriptionFormData } from '../types';
import { useTranslation } from 'react-i18next';

const NewSubscription = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = useCallback(async (data: SubscriptionFormData) => {
    try {
      await subscriptionsApi.create(data);
      navigate('/');
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw error;
    }
  }, [navigate]);

  const handleCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('subscriptions.newTitle')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('subscriptions.newSubtitle')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <SubscriptionForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewSubscription;
