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
import type { Subscription } from '../types';

interface MonthlyChartProps {
  subscriptions: Subscription[];
}

const MonthlyChart = memo(({ subscriptions }: MonthlyChartProps) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();

  const monthlyData = months.map((month, index) => {
    const monthSubscriptions = subscriptions.filter((sub) => {
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`$${value}`, 'Amount']}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
          />
          <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

MonthlyChart.displayName = 'MonthlyChart';

export default MonthlyChart;
