import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Select from '../components/ui/Select';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.startsWith('es') ? 'es' : 'en';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('settings.subtitle')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md divide-y divide-gray-200 dark:divide-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('settings.profileInfo')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.email')}</label>
                <p className="text-gray-900 dark:text-white">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.name')}</label>
                <p className="text-gray-900 dark:text-white">{user?.name || t('settings.notSet')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.role')}</label>
                <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-400">
                  {user?.role ? t(`roles.${user.role}`) : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('settings.appearance')}</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.darkMode')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.darkModeDesc')}</p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-10 w-20 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors cursor-pointer"
              >
                <span
                  className={`inline-flex h-8 w-8 transform items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow transition-transform cursor-pointer ${
                    theme === 'dark' ? 'translate-x-10' : 'translate-x-1'
                  }`}
                >
                  {theme === 'dark' ? (
                    <Moon size={16} className="text-blue-500" />
                  ) : (
                    <Sun size={16} className="text-yellow-500" />
                  )}
                </span>
              </button>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('settings.language')}</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.language')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.languageDesc')}</p>
              </div>
              <div className="w-40">
                <Select
                  id="language"
                  name="language"
                  value={currentLanguage}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  options={[
                    { value: 'en', label: t('language.english') },
                    { value: 'es', label: t('language.spanish') },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('settings.accountActions')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('settings.accountActionsDesc')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
