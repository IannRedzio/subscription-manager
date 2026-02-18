import { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { categoriesApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Subscription, SubscriptionFormData } from '../types';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { useTranslation } from 'react-i18next';

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (data: SubscriptionFormData) => Promise<void>;
  onCancel: () => void;
}

const SubscriptionForm = ({ subscription, onSubmit, onCancel }: SubscriptionFormProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isAdmin = user?.role === 'ADMIN';
  const [formData, setFormData] = useState<SubscriptionFormData>(() => {
    if (subscription) {
      return {
        name: subscription.name,
        description: subscription.description || '',
        category: subscription.category,
        amount: subscription.amount,
        currency: subscription.currency,
        billingCycle: subscription.billingCycle,
        isTrial: subscription.isTrial,
        trialEndDate: subscription.trialEndDate ? format(new Date(subscription.trialEndDate), 'yyyy-MM-dd') : '',
        nextBillingDate: format(new Date(subscription.nextBillingDate), 'yyyy-MM-dd'),
        notes: subscription.notes || '',
      };
    }
    return {
      name: '',
      description: '',
      category: '',
      amount: 0,
      currency: 'USD',
      billingCycle: 'MONTHLY',
      isTrial: false,
      trialEndDate: '',
      nextBillingDate: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
    };
  });

  const [categories, setCategories] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modal para crear categoría
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3b82f6' });
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data.map((cat) => ({ value: cat.name, label: cat.name })));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 :
              type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              value,
    }));

    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = t('validation.nameRequired');
    if (!formData.category) newErrors.category = t('validation.categoryRequired');
    if (formData.amount <= 0) newErrors.amount = t('validation.amountPositive');
    if (!formData.nextBillingDate) newErrors.nextBillingDate = t('validation.nextBillingRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setCategoryError(t('validation.categoryNameRequired'));
      return;
    }

    setCreatingCategory(true);
    setCategoryError('');
    try {
      await categoriesApi.create({
        name: newCategory.name.trim(),
        color: newCategory.color,
      });
      await fetchCategories();
      setFormData((prev) => ({ ...prev, category: newCategory.name.trim() }));
      setNewCategory({ name: '', color: '#3b82f6' });
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      setCategoryError(err.response?.data?.error || t('categories.failedToCreate'));
    } finally {
      setCreatingCategory(false);
    }
  };

  const billingCycleOptions = [
    { value: 'MONTHLY', label: t('billingCycle.MONTHLY') },
    { value: 'YEARLY', label: t('billingCycle.YEARLY') },
    { value: 'WEEKLY', label: t('billingCycle.WEEKLY') },
  ];

  const currencyOptions = [
    { value: 'USD', label: t('currency.USD') },
    { value: 'EUR', label: t('currency.EUR') },
    { value: 'GBP', label: t('currency.GBP') },
    { value: 'JPY', label: t('currency.JPY') },
    { value: 'ARS', label: t('currency.ARS') },
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('form.subscriptionName')}
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder={t('form.subscriptionPlaceholder')}
          required
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('form.description')}
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t('form.descriptionPlaceholder')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('form.category')}
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={categories}
                error={errors.category}
                required
              />
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                title={t('form.createNewCategory')}
              >
                <Plus size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t('form.amount')}
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
            required
          />

          <Select
            label={t('form.currency')}
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            options={currencyOptions}
          />
        </div>

        <Select
          label={t('form.billingCycle')}
          id="billingCycle"
          name="billingCycle"
          value={formData.billingCycle}
          onChange={handleChange}
          options={billingCycleOptions}
        />

        <div className="flex items-center gap-2">
          <input
            id="isTrial"
            name="isTrial"
            type="checkbox"
            checked={formData.isTrial}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-800"
          />
          <label htmlFor="isTrial" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.isTrial')}
          </label>
        </div>

        {formData.isTrial && (
          <Input
            label={t('form.trialEndDate')}
            id="trialEndDate"
            name="trialEndDate"
            type="date"
            value={formData.trialEndDate}
            onChange={handleChange}
          />
        )}

        <Input
          label={t('form.nextBillingDate')}
          id="nextBillingDate"
          name="nextBillingDate"
          type="date"
          value={formData.nextBillingDate}
          onChange={handleChange}
          error={errors.nextBillingDate}
          required
        />

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('form.notes')}
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder={t('form.notesPlaceholder')}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" loading={loading}>
            {subscription ? t('actions.update') : t('actions.create')} {t('subscriptions.label')}
          </Button>
        </div>
      </form>

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setCategoryError('');
          setNewCategory({ name: '', color: '#3b82f6' });
        }}
        title={t('form.newCategoryTitle')}
        size="sm"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input
            label={t('categories.categoryName')}
            id="newCategoryName"
            name="newCategoryName"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder={t('form.newCategoryPlaceholder')}
            required
          />

          <div>
            <label htmlFor="categoryColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('form.color')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="categoryColor"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{newCategory.color}</span>
            </div>
          </div>

          {categoryError && (
            <p className="text-red-500 text-sm">{categoryError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCategoryModalOpen(false);
                setCategoryError('');
              }}
            >
                {t('actions.cancel')}
            </Button>
            <Button type="submit" loading={creatingCategory}>
              {t('actions.create')}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SubscriptionForm;
