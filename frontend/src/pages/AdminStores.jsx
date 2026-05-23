import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AdminLayout from '../components/AdminLayout';
import axiosInstance from '../utils/axiosInstance';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering & Sorting State
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [owners, setOwners] = useState([]);
  const [ownersLoading, setOwnersLoading] = useState(false);
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
      ownerId: '',
    }
  });

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = {
        name: filters.name,
        email: filters.email,
        address: filters.address,
        sortBy: sort.field,
        sortOrder: sort.order,
      };
      const response = await axiosInstance.get('/api/admin/stores', { params });
      setStores(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
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

  const fetchOwners = async () => {
    setOwnersLoading(true);
    setModalError('');
    try {
      const response = await axiosInstance.get('/api/admin/users', {
        params: { role: 'STORE_OWNER' },
      });
      setOwners(response.data);
    } catch (err) {
      setModalError('Failed to fetch eligible store owners');
    } finally {
      setOwnersLoading(false);
    }
  };

  const openModal = () => {
    setModalError('');
    setIsModalOpen(true);
    fetchOwners();
  };

  const onCreateStore = async (data) => {
    setModalLoading(true);
    setModalError('');
    try {
      await axiosInstance.post('/api/admin/stores', data);
      setIsModalOpen(false);
      reset();
      fetchStores();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create store');
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
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-sans">Store Provisioning Directory</h2>
        <button
          onClick={openModal}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          Add Store
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Filter Records</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Store Name</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search by store name..."
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
        </div>
      </div>

      {/* Stores Table */}
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
                  onClick={() => handleSort('averageRating')}
                  className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Rating {sort.field === 'averageRating' && (sort.order === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">Owner Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Refreshing list...</span>
                    </div>
                  </td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500 dark:text-slate-400">
                    No matching stores found.
                  </td>
                </tr>
              ) : (
                stores.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{s.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{s.email}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 truncate max-w-xs">{s.address}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-amber-500 font-bold">★</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {s.averageRating > 0 ? s.averageRating.toFixed(1) : '0.0'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{s.ownerName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Store Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs px-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Add New Store</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onCreateStore)} className="p-6 space-y-4">
              {modalError && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 px-4 py-2.5 rounded-lg text-xs text-center">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Store Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Store name is required' })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  placeholder="Enter store name"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Store Email</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Store email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  placeholder="store@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Store Address</label>
                <textarea
                  rows="2"
                  {...register('address', { required: 'Store address is required' })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  placeholder="Enter store address"
                />
                {errors.address && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Store Owner</label>
                {ownersLoading ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Loading store owners...</p>
                ) : (
                  <select
                    {...register('ownerId', { required: 'Please select an owner' })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Select a Store Owner...</option>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                        {owner.name} ({owner.email})
                      </option>
                    ))}
                  </select>
                )}
                {errors.ownerId && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.ownerId.message}</p>}
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
                  disabled={modalLoading || ownersLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md transition-colors disabled:bg-indigo-400 cursor-pointer"
                >
                  {modalLoading ? 'Saving...' : 'Add Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminStores;
