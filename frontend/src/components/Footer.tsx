import { memo } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('footer.rights', { year: currentYear })}
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('footer.terms')}
            </a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('footer.support')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
