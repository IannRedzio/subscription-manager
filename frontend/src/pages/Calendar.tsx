import { useState, useEffect, useCallback, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { subscriptionsApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import type { Subscription } from '../types';

const Calendar = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await subscriptionsApi.getAll();
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [currentDate]);

  const getSubscriptionsForDay = useCallback((date: Date) => {
    return subscriptions.filter((sub) => {
      const billingDate = new Date(sub.nextBillingDate);
      return isSameDay(billingDate, date);
    });
  }, [subscriptions]);

  const previousMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  }, [currentDate]);

  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  }, [currentDate]);

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View upcoming billing dates</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={previousMonth}>
              Previous
            </Button>
            <span className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button variant="secondary" onClick={nextMonth}>
              Next
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-gray-50 dark:bg-gray-800 p-3 text-center font-medium text-gray-700 dark:text-gray-300">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
            {days.map((day) => {
              const daySubscriptions = getSubscriptionsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);

              return (
                <div
                  key={day.toString()}
                  className={`min-h-32 p-2 ${
                    isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                  } ${isDayToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  <div
                    className={`text-sm font-medium ${
                      isDayToday
                        ? 'text-blue-600 dark:text-blue-400'
                        : isCurrentMonth
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-600'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>
                  <div className="mt-1 space-y-1">
                    {daySubscriptions.map((sub) => (
                      <div
                        key={sub.id}
                        className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-400 truncate cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900"
                        title={`${sub.name} - $${sub.amount.toFixed(2)}`}
                      >
                        {sub.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Calendar;
