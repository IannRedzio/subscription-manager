import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const processCallback = async () => {
      const token = searchParams.get('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        localStorage.setItem('token', token);
        const response = await authApi.getMe();
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        navigate('/');
      } catch (error) {
        console.error('Failed to process OAuth callback:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    processCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">{t('auth.processingLogin')}</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
