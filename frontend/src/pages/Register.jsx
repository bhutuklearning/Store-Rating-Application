import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post('/api/auth/register', data);
      const { token, user } = response.data;
      
      login(token, user);
      navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative">
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
            Join StoreRate to read and write reviews
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm relative text-center" role="alert">
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 20, message: 'Name must be at least 20 characters' },
                maxLength: { value: 60, message: 'Name cannot exceed 60 characters' },
              })}
              className="appearance-none block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="Enter name (20–60 characters)"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="appearance-none block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Address
            </label>
            <textarea
              id="address"
              rows="3"
              {...register('address', {
                required: 'Address is required',
                maxLength: { value: 400, message: 'Address cannot exceed 400 characters' },
              })}
              className="appearance-none block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="Enter address (max 400 characters)"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be 8–16 characters' },
                  maxLength: { value: 16, message: 'Password must be 8–16 characters' },
                  validate: {
                    hasUppercase: (v) => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
                    hasSpecialChar: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Password must contain at least one special character',
                  },
                })}
                className="appearance-none block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 shadow-md disabled:bg-indigo-400 dark:disabled:bg-indigo-800 cursor-pointer transition-colors"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <span>Registering...</span>
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

