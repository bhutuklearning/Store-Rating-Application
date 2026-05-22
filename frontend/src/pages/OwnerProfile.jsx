import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import UserOwnerLayout from '../components/UserOwnerLayout';
import axiosInstance from '../utils/axiosInstance';

const OwnerProfile = () => {
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await axiosInstance.patch('/api/auth/change-password', {
        password: data.password,
      });
      setSuccessMsg('Your password has been changed successfully.');
      reset();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserOwnerLayout>
      <div className="max-w-md mx-auto py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Change Owner Password</h2>
          <p className="text-slate-500 text-sm mt-0.5">Keep your account secure by updating your password regularly</p>
        </div>

        {successMsg && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-lg text-sm text-center">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'New password is required',
                minLength: { value: 8, message: 'Password must be 8–16 characters' },
                maxLength: { value: 16, message: 'Password must be 8–16 characters' },
                validate: {
                  hasUppercase: (v) => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
                  hasSpecialChar: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Password must contain at least one special character',
                },
              })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your new password',
              })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-colors disabled:bg-indigo-400 cursor-pointer"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </UserOwnerLayout>
  );
};

export default OwnerProfile;
