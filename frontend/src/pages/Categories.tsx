import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { categoriesApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import type { Category } from '../types';

const Categories = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3b82f6', icon: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setError('Category name is required');
      return;
    }

    setCreating(true);
    setError('');
    try {
      await categoriesApi.create({
        name: newCategory.name.trim(),
        color: newCategory.color,
        icon: newCategory.icon || undefined,
      });
      setNewCategory({ name: '', color: '#3b82f6', icon: '' });
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Browse available subscription categories</p>
          </div>
          {isAdmin && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              New Category
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              style={{ borderTop: `4px solid ${category.color || '#3b82f6'}` }}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                {category.color && (
                  <div className="mt-3 flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{category.color}</span>
                  </div>
                )}
                {category.icon && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Icon:</span> {category.icon}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError('');
          setNewCategory({ name: '', color: '#3b82f6', icon: '' });
        }}
        title="New Category"
        size="sm"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input
            label="Category Name"
            id="categoryName"
            name="categoryName"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="e.g., Entertainment, Productivity"
            required
          />

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{newCategory.color}</span>
            </div>
          </div>

          <Input
            label="Icon (optional)"
            id="icon"
            name="icon"
            value={newCategory.icon}
            onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
            placeholder="e.g., music, video, cloud"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setError('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={creating}>
              Create Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
