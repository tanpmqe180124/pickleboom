import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface PartnerRouteProps {
  children: React.ReactNode;
}

const PartnerRoute: React.FC<PartnerRouteProps> = ({ children }) => {
  const { userRole, isAuthenticated } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has partner role
  const isPartner = userRole === 'partner' || userRole?.toLowerCase() === 'partner';
  
  if (!isPartner) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PartnerRoute;


