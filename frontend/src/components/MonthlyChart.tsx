import { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import type { Subscription } from '../types';
import { useTranslation } from 'react-i18next';

interface MonthlyChartProps {
  subscriptions: Subscription[];
}

const MonthlyChart = memo(({ subscriptions }: MonthlyChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslation();

  const months = t('months', { returnObjects: true }) as string[];
  const currentYear = new Date().getFullYear();

  const safeSubscriptions = subscriptions || [];

  const monthlyData = months.map((month, index) => {
    const monthSubscriptions = safeSubscriptions.filter((sub) => {
      const billingDate = new Date(sub.nextBillingDate);
      return billingDate.getMonth() === index && billingDate.getFullYear() === currentYear;
    });

    const total = monthSubscriptions.reduce((sum, sub) => {
      if (sub.billingCycle === 'MONTHLY') return sum + sub.amount;
      if (sub.billingCycle === 'YEARLY') return sum + sub.amount / 12;
      if (sub.billingCycle === 'WEEKLY') return sum + sub.amount * 4.33;
      return sum;
    }, 0);

    return { name: month, amount: total.toFixed(2) };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('charts.monthlySpending')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#6b7280'} />
          <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
          <Tooltip
            formatter={(value) => [`$${value}`, t('charts.amount')]}
            contentStyle={{
              borderRadius: '8px',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              color: isDark ? '#f3f4f6' : '#111827',
            }}
            labelStyle={{ color: isDark ? '#f3f4f6' : '#111827' }}
          />
          <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

MonthlyChart.displayName = 'MonthlyChart';

export default MonthlyChart;
