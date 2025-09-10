import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { authApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(loginStart());
    
    try {
      const response = await authApi.login(credentials);
      
      if (response.success && response.user && response.token) {
        dispatch(loginSuccess({
          user: response.user,
          token: response.token,
        }));
        toast.success('Welcome back!');
      } else {
        dispatch(loginFailure(response.message || 'Login failed'));
        toast.error(response.message || 'Login failed');
      }
    } catch {
      dispatch(loginFailure('An error occurred during login'));
      toast.error('An error occurred during login');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleDemoLogin = () => {
    setCredentials({
      username: 'test',
      password: 'test123',
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm sm:max-w-md"
      >
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-large"
          >
            <UserIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2"
          >
            Welcome Back
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base text-surface-600 dark:text-surface-400"
          >
            Sign in to your account to continue
          </motion.p>
        </div>

        <Card className="animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-4">
              <Input
                label="Username"
                name="username"
                type="text"
                value={credentials.username}
                onChange={handleChange}
                error={errors.username}
                leftIcon={<UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                placeholder="Enter your username"
                autoComplete="username"
              />

              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={<LockClosedIcon className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                }
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            <div className="space-y-3 sm:space-y-4">
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                size="lg"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
                disabled={loading}
                size="lg"
              >
                Use Demo Credentials
              </Button>
            </div>
          </form>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-surface-200 dark:border-surface-700">
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 sm:p-4">
              <h3 className="text-sm font-medium text-primary-800 dark:text-primary-200 mb-2">
                Demo Credentials
              </h3>
              <div className="text-sm text-primary-700 dark:text-primary-300 space-y-1">
                <p><span className="font-medium">Username:</span> test</p>
                <p><span className="font-medium">Password:</span> test123</p>
              </div>
            </div>
          </div>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6"
        >
          This is a demo application with mocked authentication
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
