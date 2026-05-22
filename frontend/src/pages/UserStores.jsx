import React, { useEffect, useState } from 'react';
import UserOwnerLayout from '../components/UserOwnerLayout';
import axiosInstance from '../utils/axiosInstance';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Rating Modal State
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = searchQuery ? { search: searchQuery } : {};
      const response = await axiosInstance.get('/api/stores', { params });
      setStores(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [searchQuery]);

  const handleRateClick = (store) => {
    setSelectedStore(store);
    setSelectedRating(store.userRating || 0);
    setSubmitError('');
  };

  const handleRatingSubmit = async () => {
    if (selectedRating < 1 || selectedRating > 5) {
      setSubmitError('Please select a rating between 1 and 5 stars');
      return;
    }
    setSubmitLoading(true);
    setSubmitError('');
    try {
      await axiosInstance.post('/api/ratings', {
        storeId: selectedStore.id,
        value: selectedRating,
      });
      setSelectedStore(null);
      fetchStores();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <UserOwnerLayout>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Browse Stores</h2>
          <p className="text-slate-500 text-sm mt-0.5">Find and rate your favorite local business</p>
        </div>
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search stores by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* Stores Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-slate-500 text-sm font-medium">Loading store listings...</p>
          </div>
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 p-6">
          <p className="text-lg font-semibold text-slate-700">No stores found</p>
          <p className="text-sm text-slate-400 mt-1">Try refining your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow hover:border-slate-300"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-850 text-lg leading-tight">{store.name}</h3>
                  <div className="flex items-center space-x-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-xs font-semibold text-amber-700">
                    <span>★</span>
                    <span>{store.averageRating > 0 ? store.averageRating.toFixed(1) : 'New'}</span>
                  </div>
                </div>
                <p className="text-slate-500 text-xs mb-4">{store.email}</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{store.address}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Rating</span>
                  <span className="text-sm font-semibold text-slate-700 mt-0.5 block">
                    {store.userRating ? (
                      <span className="text-indigo-600">★ {store.userRating} / 5</span>
                    ) : (
                      <span className="text-slate-400">Not rated</span>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => handleRateClick(store)}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors border border-indigo-100 cursor-pointer"
                >
                  {store.userRating ? 'Edit Rating' : 'Rate Store'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Selection Modal */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-md">Rate this Store</h3>
              <button
                onClick={() => setSelectedStore(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 text-center space-y-6">
              <div>
                <h4 className="font-bold text-slate-800 text-lg">{selectedStore.name}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{selectedStore.address}</p>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                  {submitError}
                </div>
              )}

              {/* Star Rating Picker */}
              <div className="flex justify-center items-center space-x-2.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl focus:outline-none transition-transform active:scale-95 cursor-pointer"
                  >
                    <span
                      className={`${
                        star <= (hoverRating || selectedRating) ? 'text-amber-500' : 'text-slate-200'
                      }`}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500">
                {selectedRating > 0 ? (
                  <span>You selected {selectedRating} star{selectedRating > 1 ? 's' : ''}</span>
                ) : (
                  <span>Select stars to grade store performance</span>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedStore(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRatingSubmit}
                  disabled={submitLoading || selectedRating === 0}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-md transition-colors disabled:bg-indigo-400 cursor-pointer"
                >
                  {submitLoading ? 'Saving...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </UserOwnerLayout>
  );
};

export default UserStores;
