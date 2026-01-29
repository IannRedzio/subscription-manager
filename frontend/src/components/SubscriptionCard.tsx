import { memo } from 'react';
import { format } from 'date-fns';
import { Calendar, Edit, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import type { Subscription } from '../types';
import Button from './ui/Button';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  TRIAL: 'bg-blue-100 text-blue-800',
};

const SubscriptionCard = ({ subscription, onEdit, onDelete, onView }: SubscriptionCardProps) => {
  const isOverdue = new Date(subscription.nextBillingDate) < new Date();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 cursor-pointer" onClick={() => onView(subscription.id)}>
          <h3 className="text-xl font-semibold text-gray-900">{subscription.name}</h3>
          {subscription.description && (
            <p className="text-sm text-gray-600 mt-1">{subscription.description}</p>
          )}
        </div>
        <span
          className={cn(
            'px-2.5 py-0.5 rounded-full text-xs font-medium',
            statusColors[subscription.status]
          )}
        >
          {subscription.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Amount</span>
          <span className="font-semibold text-gray-900">
            {subscription.currency} {subscription.amount.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Billing Cycle</span>
          <span className="font-medium text-gray-900">{subscription.billingCycle}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-gray-500" />
          <span className="text-gray-600">Next billing:</span>
          <span className={cn('font-medium', isOverdue && 'text-red-600')}>
            {format(new Date(subscription.nextBillingDate), 'MMM dd, yyyy')}
          </span>
          {isOverdue && <AlertCircle size={16} className="text-red-600" />}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(subscription.id)}
          className="flex items-center gap-1"
        >
          <Edit size={16} />
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(subscription.id)}
          className="flex items-center gap-1"
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default memo(SubscriptionCard);
