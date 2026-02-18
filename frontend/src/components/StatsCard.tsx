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

const gradientMap = {
  dollar: 'from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700',
  calendar: 'from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700',
  trending: 'from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700',
  alert: 'from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700',
};

const StatsCard = memo(({ title, value, icon = 'dollar', trend, className }: StatsCardProps) => {
  const Icon = iconMap[icon];
  const gradient = gradientMap[icon];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5',
        `bg-gradient-to-br ${gradient}`,
        className
      )}
    >
      {/* Decorative circle */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/5" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="text-3xl font-bold text-white mt-1 tracking-tight">{value}</p>
          {trend && (
            <p
              className={cn(
                'text-sm mt-1 font-medium',
                trend.positive ? 'text-emerald-200' : 'text-red-200'
              )}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;
