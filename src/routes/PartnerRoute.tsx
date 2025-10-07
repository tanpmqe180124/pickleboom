import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/utils/toastManager';

const PartnerRoute: React.FC = () => {
  const { userRole, accessToken } = useAuth();

  const isPartner = userRole === 'Partner' || userRole?.toLowerCase() === 'partner';
  
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!isPartner) {
    showToast.error('Không có quyền truy cập', 'Bạn không có quyền partner để truy cập trang này.');
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PartnerRoute;