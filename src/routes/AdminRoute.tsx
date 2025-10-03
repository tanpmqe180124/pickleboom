import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/utils/toastManager';

const AdminRoute: React.FC = () => {
  const { userRole, accessToken } = useAuth();

  const isAdmin = userRole === 'admin' || userRole?.toLowerCase() === 'admin';
  
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    showToast.error('Không có quyền truy cập', 'Bạn không có quyền admin để truy cập trang này.');
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

