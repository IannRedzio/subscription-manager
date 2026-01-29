import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { subscriptionsApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SubscriptionForm from '../components/SubscriptionForm';
import type { Subscription, SubscriptionFormData } from '../types';

const EditSubscription = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
      setError('Failed to fetch subscription');
      console.error('Failed to fetch subscription:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Subscription not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Subscription</h1>
          <p className="text-gray-600 mt-1">Update subscription details</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <SubscriptionForm subscription={subscription} onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditSubscription;
