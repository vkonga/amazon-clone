import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuth, selectIsAdmin } from '../../features/auth/authSlice';

export const ProtectedRoute = ({ children }) => {
  const isAuth = useSelector(selectIsAuth);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export const AdminRoute = ({ children }) => {
  const isAuth  = useSelector(selectIsAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const location = useLocation();

  if (!isAuth)  return <Navigate to="/login"  state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/"       replace />;
  return children;
};
