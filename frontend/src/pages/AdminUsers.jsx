import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import axiosInstance from '../utils/axiosInstance';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering & Sorting State
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      address: '',
      password: '',
      role: 'USER'
    }
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        name: filters.name,
        email: filters.email,
        address: filters.address,
        role: filters.role || undefined,
        sortBy: sort.field,
        sortOrder: sort.order,
      };
      const response = await axiosInstance.get('/api/admin/users', { params });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, sort]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const onCreateUser = async (data) => {
    setModalLoading(true);
    setModalError('');
    try {
      await axiosInstance.post('/api/admin/users', data);
      setIsModalOpen(false);
      reset();
      fetchUsers();
    } catch (err) {
      setModalError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create user');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <AdminLayout>
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">User Directory</h2>
        <button
          onClick={() => {
            setModalError('');
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          Add User
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Filter Records</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email</label>
            <input
              type="text"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              placeholder="Search by email..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={filters.address}
              onChange={handleFilterChange}
              placeholder="Search by address..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Role</label>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">All Roles</option>
              <option value="USER" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">User</option>
              <option value="STORE_OWNER" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Store Owner</option>
              <option value="ADMIN" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">System Administrator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
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
                  onClick={() => handleSort('address')}
                  className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Address {sort.field === 'address' && (sort.order === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  onClick={() => handleSort('role')}
                  className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Role {sort.field === 'role' && (sort.order === 'asc' ? '▲' : '▼')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Refreshing list...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-500 dark:text-slate-400">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => navigate(`/admin/users/${u.id}`)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{u.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-350">{u.email}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-355 truncate max-w-xs">{u.address}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                          u.role === 'ADMIN'
                            ? 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50'
                            : u.role === 'STORE_OWNER'
                            ? 'bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50'
                        }`}
                      >
                        {u.role === 'ADMIN' ? 'ADMIN' : u.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs px-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Add New User Account</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onCreateUser)} className="p-6 space-y-4">
              {modalError && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 px-4 py-2.5 rounded-lg text-xs text-center">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 20, message: 'Name must be 20–60 characters' },
                    maxLength: { value: 60, message: 'Name cannot exceed 60 characters' },
                  })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  placeholder="System Administrator etc. (20-60 chars)"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Address</label>
                <textarea
                  rows="2"
                  {...register('address', {
                    required: 'Address is required',
                    maxLength: { value: 400, message: 'Address cannot exceed 400 characters' },
                  })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  placeholder="Address details (max 400 chars)"
                />
                {errors.address && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be 8–16 characters' },
                    maxLength: { value: 16, message: 'Password must be 8–16 characters' },
                    validate: {
                      hasUppercase: (v) => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
                      hasSpecialChar: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Password must contain at least one special character',
                    },
                  })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  placeholder="Password (8-16 chars, 1 upper, 1 special)"
                />
                {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Account Role</label>
                <select
                  {...register('role', { required: 'Role is required' })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="USER" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">User (Reviewer)</option>
                  <option value="STORE_OWNER" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Store Owner</option>
                  <option value="ADMIN" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">System Administrator</option>
                </select>
                {errors.role && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.role.message}</p>}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md transition-colors disabled:bg-indigo-400 cursor-pointer"
                >
                  {modalLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
