import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait for the server verification token check to finish
  if (loading) {
    return <div className="container" style={{ padding: '2rem' }}><h3>Validating Admin Session Credentials...</h3></div>;
  }

  // Double check that user model contains role === 'admin'
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}