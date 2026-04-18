import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'Admin') return <Navigate to="/admin" replace />;
    if (user.role === 'Employee') return <Navigate to="/employee" replace />;
    if (user.role === 'Customer') return <Navigate to="/customer" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
