// src/routes/AdminRoutes.jsx
import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import { isAuthenticated, isAdmin } from '../services/authService';

// Protected route component that checks if user is authenticated and is an admin
const AdminProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin()) {
    // Redirect to home if authenticated but not an admin
    return <Navigate to="/" replace />;
  }
  
  // Render children if authenticated and admin
  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/admin" 
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } 
      />
      {/* Add more admin routes as needed */}
    </Routes>
  );
};

export default AdminRoutes;