import { memo } from 'react';
import { DollarSign, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: 'dollar' | 'calendar' | 'trending' | 'alert';
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const iconMap = {
  dollar: DollarSign,
  calendar: Calendar,
  trending: TrendingUp,
  alert: AlertCircle,
};

const StatsCard = memo(({ title, value, icon = 'dollar', trend, className }: StatsCardProps) => {
  const Icon = iconMap[icon];

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-md p-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend && (
            <p className={cn('text-sm mt-1', trend.positive ? 'text-green-600' : 'text-red-600')}>
              {trend.positive ? '+' : '-'}{trend.value}%
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;
