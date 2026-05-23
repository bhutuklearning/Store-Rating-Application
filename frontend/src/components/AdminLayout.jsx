import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 dark:bg-slate-900/90 text-white flex flex-col shadow-xl border-r border-slate-800">
        <div className="h-16 flex items-center justify-center border-b border-slate-800 px-6">
          <Link to="/admin/dashboard" className="text-xl font-bold tracking-tight text-indigo-400 flex items-center space-x-2">
            <span>RateStore Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/admin/dashboard')
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/users"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/admin/users') || (location.pathname.startsWith('/admin/users/') && !isActive('/admin/users'))
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>Users Management</span>
          </Link>
          <Link
            to="/admin/stores"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/admin/stores')
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>Stores Management</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shadow-sm transition-colors duration-300">
          <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            {isActive('/admin/dashboard') && 'Dashboard Overview'}
            {isActive('/admin/users') && 'Manage Users'}
            {location.pathname.startsWith('/admin/users/') && !isActive('/admin/users') && 'User Profile Detail'}
            {isActive('/admin/stores') && 'Manage Stores'}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="text-right ml-4">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.name}</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 shadow-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dynamic page contents */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 p-8 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
