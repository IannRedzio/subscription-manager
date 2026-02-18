import { memo } from 'react';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { Calendar, Edit, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import type { Subscription } from '../types';
import Button from './ui/Button';
import { useTranslation } from 'react-i18next';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400',
  PAUSED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400',
  TRIAL: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400',
};

const SubscriptionCard = ({ subscription, onEdit, onDelete, onView }: SubscriptionCardProps) => {
  const isOverdue = new Date(subscription.nextBillingDate) < new Date();
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('es') ? es : enUS;
  const statusLabel = t(`status.${subscription.status}`);
  const billingCycleLabel = t(`billingCycle.${subscription.billingCycle}`);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 cursor-pointer" onClick={() => onView(subscription.id)}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{subscription.name}</h3>
          {subscription.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subscription.description}</p>
          )}
        </div>
        <span
          className={cn(
            'px-2.5 py-0.5 rounded-full text-xs font-medium',
            statusColors[subscription.status]
          )}
        >
          {statusLabel}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">{t('subscriptions.amount')}</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {subscription.currency} {subscription.amount.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">{t('subscriptions.billingCycle')}</span>
          <span className="font-medium text-gray-900 dark:text-white">{billingCycleLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">{t('subscriptions.nextBilling')}</span>
          <span className={cn('font-medium', isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white')}>
            {format(new Date(subscription.nextBillingDate), 'MMM dd, yyyy', { locale })}
          </span>
          {isOverdue && <AlertCircle size={16} className="text-red-600 dark:text-red-400" />}
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
          {t('actions.edit')}
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(subscription.id)}
          className="flex items-center gap-1"
        >
          <Trash2 size={16} />
          {t('actions.delete')}
        </Button>
      </div>
    </div>
  );
};

export default memo(SubscriptionCard);
