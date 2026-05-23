import React, { useEffect, useState } from 'react';
import UserOwnerLayout from '../components/UserOwnerLayout';
import axiosInstance from '../utils/axiosInstance';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Sort State
  const [sort, setSort] = useState({ field: 'date', order: 'desc' });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/owner/dashboard');
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch store owner metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortedReviewers = () => {
    if (!data?.reviewers) return [];
    
    const sorted = [...data.reviewers];
    sorted.sort((a, b) => {
      let valA = a[sort.field];
      let valB = b[sort.field];

      if (sort.field === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sort.order === 'asc' ? -1 : 1;
      if (valA > valB) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  if (loading) {
    return (
      <UserOwnerLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </UserOwnerLayout>
    );
  }

  if (error) {
    return (
      <UserOwnerLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
          {error}
        </div>
      </UserOwnerLayout>
    );
  }

  const sortedReviewers = getSortedReviewers();

  return (
    <UserOwnerLayout>
      <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{data?.storeName || 'Store Owner'} Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Real-time breakdown of reviews and rating metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Prominent Avg Rating */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl animate-pulse">
            <span className="text-3xl font-extrabold">★</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Average Store Rating</p>
            <p className="text-4xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {data?.averageRating > 0 ? data.averageRating.toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        {/* Total Reviews Count */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Reviews Received</p>
            <p className="text-4xl font-black text-slate-900 dark:text-slate-100 mt-1">{data?.reviewers?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Reviewers Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Rating Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Name {sort.field === 'name' && (sort.order === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  onClick={() => handleSort('email')}
                  className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Email {sort.field === 'email' && (sort.order === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  onClick={() => handleSort('rating')}
                  className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Rating {sort.field === 'rating' && (sort.order === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  onClick={() => handleSort('date')}
                  className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Date {sort.field === 'date' && (sort.order === 'asc' ? '▲' : '▼')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {sortedReviewers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-500 dark:text-slate-400">
                    No reviews have been submitted for your store yet.
                  </td>
                </tr>
              ) : (
                sortedReviewers.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{r.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{r.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-amber-500 font-bold">★</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{r.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {new Date(r.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </UserOwnerLayout>
  );
};

export default OwnerDashboard;
