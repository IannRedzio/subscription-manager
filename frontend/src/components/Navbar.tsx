import { memo, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Plus,
  Home,
  CreditCard,
  BarChart3,
  Calendar as CalendarIcon,
  Tag,
  Moon,
  Sun,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import UserMenu from './UserMenu';
import { useTranslation } from 'react-i18next';

const Navbar = memo(() => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: t('nav.dashboard') },
    { path: '/subscriptions', icon: CreditCard, label: t('nav.subscriptions') },
    { path: '/stats', icon: BarChart3, label: t('nav.statistics') },
    { path: '/calendar', icon: CalendarIcon, label: t('nav.calendar') },
    { path: '/categories', icon: Tag, label: t('nav.categories') },
  ];

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-gray-200/60 dark:border-white/8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-gray-900/60">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-6 min-w-0">
              <Link to="/" className="flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 bg-linear-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <span className="text-white font-bold text-sm tracking-tight">SM</span>
                </div>
                <span className="hidden sm:block font-bold text-lg text-gray-900 dark:text-white whitespace-nowrap">
                  {t('app.name')}
                </span>
              </Link>

              {/* Desktop Nav Items */}
              <div className="hidden 2xl:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-linear-to-r from-violet-500/10 to-purple-500/10 text-violet-700 dark:text-violet-300 shadow-sm shadow-violet-500/5'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/70 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/6'
                      }`}
                    >
                      <Icon
                        size={17}
                        className={isActive ? 'text-violet-600 dark:text-violet-400' : ''}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* CTA — hidden on mobile, shown as icon-only on sm, full on md+ */}
              <Link
                to="/subscriptions/new"
                className="hidden sm:flex items-center gap-2 bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/30 whitespace-nowrap"
              >
                <Plus size={17} />
                <span className="hidden md:inline">{t('nav.newSubscription')}</span>
              </Link>

              <UserMenu />

              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100/70 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/6 transition-all duration-200 hover:cursor-pointer"
                aria-label={t('nav.toggleTheme')}
              >
                {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={toggleMobileMenu}
                className="2xl:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100/70 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/6 transition-all duration-200 hover:cursor-pointer"
                aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.menu')}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`2xl:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pb-4 pt-2 space-y-1 border-t border-gray-200/60 dark:border-white/6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-linear-to-r from-violet-500/10 to-purple-500/10 text-violet-700 dark:text-violet-300'
                      : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/6 dark:hover:text-white'
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      isActive
                        ? 'text-violet-600 dark:text-violet-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }
                  />
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile CTA */}
            <Link
              to="/subscriptions/new"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 mt-3 w-full bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-md shadow-violet-500/25"
            >
              <Plus size={18} />
              {t('nav.newSubscription')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Backdrop overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm 2xl:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
