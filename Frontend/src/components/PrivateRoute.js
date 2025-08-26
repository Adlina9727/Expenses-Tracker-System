import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export { PrivateRoute, ProtectedRoute };
export default PrivateRoute;