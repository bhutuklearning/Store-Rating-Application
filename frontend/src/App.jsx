import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import AdminUserDetail from './pages/AdminUserDetail';
import UserStores from './pages/UserStores';
import UserProfile from './pages/UserProfile';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerProfile from './pages/OwnerProfile';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Root Route */}
            <Route path="/" element={<Landing />} />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminUserDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminStores />
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/stores"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <UserStores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            {/* Store Owner Routes */}
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/profile"
              element={
                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                  <OwnerProfile />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
