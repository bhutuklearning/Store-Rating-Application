import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserOwnerLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isUser = user?.role === 'USER';
  const isOwner = user?.role === 'STORE_OWNER';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Nav links */}
            <div className="flex items-center">
              <Link
                to={isUser ? '/stores' : '/owner/dashboard'}
                className="text-2xl font-extrabold text-indigo-600 tracking-tight"
              >
                StoreRate
              </Link>
              <div className="ml-8 flex space-x-6">
                {isUser && (
                  <>
                    <Link
                      to="/stores"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        location.pathname === '/stores'
                          ? 'border-indigo-500 text-slate-900'
                          : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                      }`}
                    >
                      Stores
                    </Link>
                    <Link
                      to="/profile"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        location.pathname === '/profile'
                          ? 'border-indigo-500 text-slate-900'
                          : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                      }`}
                    >
                      Change Password
                    </Link>
                  </>
                )}
                {isOwner && (
                  <>
                    <Link
                      to="/owner/dashboard"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        location.pathname === '/owner/dashboard'
                          ? 'border-indigo-500 text-slate-900'
                          : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                      }`}
                    >
                      Store Dashboard
                    </Link>
                    <Link
                      to="/owner/profile"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        location.pathname === '/owner/profile'
                          ? 'border-indigo-500 text-slate-900'
                          : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                      }`}
                    >
                      Change Password
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Profile Info and Logout */}
            <div className="flex items-center space-x-6">
              <div className="hidden sm:text-right sm:block">
                <span className="block text-sm font-bold text-slate-900">{user?.name}</span>
                <span className="block text-xs font-semibold text-indigo-600 capitalize">
                  {user?.role === 'STORE_OWNER' ? 'Store Owner' : 'Reviewer'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-sm font-medium rounded-lg transition-all cursor-pointer shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Page Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} StoreRate Application. All rights reserved.
      </footer>
    </div>
  );
};

export default UserOwnerLayout;
