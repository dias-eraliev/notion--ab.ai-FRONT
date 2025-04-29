import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthPayload, useAuth } from '../contexts/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: AuthPayload["role"][];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { token, payload } = useAuth();
  
  // Not authenticated
  if (!token || !payload) {
    return <Navigate to="/login" />;
  }
  
  // Check if user role is allowed
  if (!allowedRoles.includes(payload.role)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

export default RoleProtectedRoute; 