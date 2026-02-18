import { Filter, X, ArrowUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SubscriptionFilters, Category } from '../types';

interface FilterPanelProps {
  filters: SubscriptionFilters;
  onFilterChange: (filters: SubscriptionFilters) => void;
  categories: Category[];
}

const FilterPanel = ({ filters, onFilterChange, categories }: FilterPanelProps) => {
  const { t } = useTranslation();

  const statusOptions = [
    { value: '', label: t('filters.allStatus') },
    { value: 'ACTIVE', label: t('status.ACTIVE') },
    { value: 'CANCELLED', label: t('status.CANCELLED') },
    { value: 'PAUSED', label: t('status.PAUSED') },
    { value: 'TRIAL', label: t('status.TRIAL') },
  ];

  const billingCycleOptions = [
    { value: '', label: t('filters.allCycles') },
    { value: 'MONTHLY', label: t('billingCycle.MONTHLY') },
    { value: 'YEARLY', label: t('billingCycle.YEARLY') },
    { value: 'WEEKLY', label: t('billingCycle.WEEKLY') },
  ];

  const categoryOptions = [
    { value: '', label: t('filters.allCategories') },
    ...categories.map((cat) => ({ value: cat.name, label: cat.name })),
  ];

  const sortOptions = [
    { value: 'nextBillingDate', label: t('filters.sortBy.nextBilling') },
    { value: 'name', label: t('filters.sortBy.name') },
    { value: 'amount', label: t('filters.sortBy.amount') },
    { value: 'createdAt', label: t('filters.sortBy.createdAt') },
    { value: 'category', label: t('filters.sortBy.category') },
  ];

  const hasActiveFilters = filters.status || filters.category || filters.billingCycle;

  const handleFilterChange = (key: keyof SubscriptionFilters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });
  };

  const toggleSortOrder = () => {
    onFilterChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-gray-500 dark:text-gray-400" />
        <h3 className="font-medium text-gray-900 dark:text-white">{t('filters.title')}</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <X size={16} />
            {t('filters.clear')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('filters.status')}
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('filters.category')}
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('filters.billingCycle')}
          </label>
          <select
            value={filters.billingCycle || ''}
            onChange={(e) => handleFilterChange('billingCycle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {billingCycleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('filters.sortBy.label')}
          </label>
          <div className="flex gap-2">
            <select
              value={filters.sortBy || 'nextBillingDate'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={toggleSortOrder}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              title={filters.sortOrder === 'desc' ? t('filters.descending') : t('filters.ascending')}
            >
              <ArrowUpDown
                size={20}
                className={filters.sortOrder === 'desc' ? 'rotate-180' : ''}
              />
            </button>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm">
              {t('filters.status')}: {t(`status.${filters.status}`)}
              <button onClick={() => handleFilterChange('status', '')} className="hover:text-blue-600 dark:hover:text-blue-200">
                <X size={14} />
              </button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full text-sm">
              {t('filters.category')}: {filters.category}
              <button onClick={() => handleFilterChange('category', '')} className="hover:text-green-600 dark:hover:text-green-200">
                <X size={14} />
              </button>
            </span>
          )}
          {filters.billingCycle && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 rounded-full text-sm">
              {t('filters.billingCycle')}: {t(`billingCycle.${filters.billingCycle}`)}
              <button onClick={() => handleFilterChange('billingCycle', '')} className="hover:text-purple-600 dark:hover:text-purple-200">
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
