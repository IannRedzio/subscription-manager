import { memo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import type { SubscriptionStats } from '../types';

interface CategoryChartProps {
  stats: SubscriptionStats;
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const CategoryChart = memo(({ stats }: CategoryChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const categoryData = (stats.byCategory || []).map((cat, index) => ({
    name: cat.category,
    value: cat.total,
    count: cat.count,
    color: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">${data.value.toFixed(2)} ({data.count} subscriptions)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: isDark ? '#f3f4f6' : '#111827' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

CategoryChart.displayName = 'CategoryChart';

export default CategoryChart;
