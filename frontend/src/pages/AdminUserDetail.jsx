import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import axiosInstance from '../utils/axiosInstance';

const AdminUserDetail = () => {
  const { id } = useParams();
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetail = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/admin/users/${id}`);
        setUserDetail(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center mb-6">
          {error}
        </div>
        <Link to="/admin/users" className="text-indigo-600 hover:text-indigo-500 font-medium">
          &larr; Back to Users List
        </Link>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link to="/admin/users" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-medium text-sm flex items-center space-x-1.5">
          <span>&larr;</span> <span>Back to Users List</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
          <div className="flex items-center space-x-4 border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
            <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 flex items-center justify-center rounded-2xl font-bold text-2xl uppercase">
              {userDetail.name ? userDetail.name.substring(0, 2) : 'US'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{userDetail.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{userDetail.email}</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 border-b border-slate-50 dark:border-slate-750/30 sm:border-none pb-2 sm:pb-0">
              <span className="font-semibold text-slate-500 dark:text-slate-450">Account ID:</span>
              <span className="sm:col-span-2 text-slate-800 dark:text-slate-200 font-mono select-all break-all">{userDetail.id}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 border-b border-slate-50 dark:border-slate-750/30 sm:border-none pb-2 sm:pb-0">
              <span className="font-semibold text-slate-500 dark:text-slate-450">Role:</span>
              <span className="sm:col-span-2">
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 uppercase">
                  {userDetail.role}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 border-b border-slate-50 dark:border-slate-750/30 sm:border-none pb-2 sm:pb-0">
              <span className="font-semibold text-slate-500 dark:text-slate-450">Registered On:</span>
              <span className="sm:col-span-2 text-slate-800 dark:text-slate-200">
                {new Date(userDetail.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
              <span className="font-semibold text-slate-500 dark:text-slate-450">Address:</span>
              <span className="sm:col-span-2 text-slate-800 dark:text-slate-200 leading-relaxed">{userDetail.address || 'Not Provided'}</span>
            </div>
          </div>
        </div>

        {/* Owned Store Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">Store Association</h3>
            {userDetail.role !== 'STORE_OWNER' ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                This account is registered as a regular reviewer, not a store owner. No stores are linked to this profile.
              </p>
            ) : !userDetail.store ? (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-400 p-4 rounded-xl text-sm">
                <p className="font-semibold mb-1">No Store Link</p>
                <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed">
                  This user has the STORE_OWNER role but has not been assigned a store yet. You can create a store for them on the Stores Management tab.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{userDetail.store.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{userDetail.store.email}</p>
                </div>
                <div className="space-y-1.5 text-xs text-slate-650 dark:text-slate-350">
                  <p>
                    <span className="font-semibold text-slate-500 dark:text-slate-455">Address: </span>
                    {userDetail.store.address}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-450">Store Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-amber-500 font-bold text-lg">★</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                      {userDetail.store.averageRating > 0 ? userDetail.store.averageRating.toFixed(1) : '0.0'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {userDetail.role === 'STORE_OWNER' && userDetail.store && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 mt-6">
              <Link
                to={`/admin/stores?name=${encodeURIComponent(userDetail.store.name)}`}
                className="block text-center py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg text-sm transition-colors"
              >
                View in Stores List
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUserDetail;
