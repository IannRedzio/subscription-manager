import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionsApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SubscriptionForm from '../components/SubscriptionForm';
import type { SubscriptionFormData } from '../types';

const NewSubscription = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">New Subscription</h1>
          <p className="text-gray-600 mt-1">Add a new subscription to track</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <SubscriptionForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewSubscription;
