import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
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
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="text-lg font-semibold text-slate-700">
            {isActive('/admin/dashboard') && 'Dashboard Overview'}
            {isActive('/admin/users') && 'Manage Users'}
            {location.pathname.startsWith('/admin/users/') && !isActive('/admin/users') && 'User Profile Detail'}
            {isActive('/admin/stores') && 'Manage Stores'}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-indigo-600 font-medium capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all border border-slate-200 hover:border-red-200 shadow-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dynamic page contents */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
