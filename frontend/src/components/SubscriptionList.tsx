import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import type { Subscription } from '../types';
import SubscriptionCard from './SubscriptionCard';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  loading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const SubscriptionList = memo(({ subscriptions, loading, onEdit, onDelete, onView }: SubscriptionListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No subscriptions yet</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Create your first subscription to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
});

SubscriptionList.displayName = 'SubscriptionList';

export default SubscriptionList;
