import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface PartnerRouteProps {
  children: React.ReactNode;
}

const PartnerRoute: React.FC<PartnerRouteProps> = ({ children }) => {
  const { userRole, isAuthenticated } = useAuth();

  console.log('=== PARTNER ROUTE DEBUG ===');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('userRole:', userRole);
  console.log('localStorage userRole:', localStorage.getItem('userRole'));

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has partner role
  const isPartner = userRole === 'Partner';
  
  console.log('isPartner:', isPartner);
  
  if (!isPartner) {
    console.log('❌ Not partner, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ Partner access granted');
  return <>{children}</>;
};

export default PartnerRoute;


