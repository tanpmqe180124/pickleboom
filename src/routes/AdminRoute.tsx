import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/infrastructure/storage/tokenStorage';
import { adminService } from '@/services/adminService';
import { showToast } from '@/utils/toastManager';

const AdminRoute: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const hasAdminRole = await adminService.checkAdminRole();
        setIsAdmin(hasAdminRole);
        
        if (!hasAdminRole) {
          showToast.error('Không có quyền truy cập', 'Bạn không có quyền admin để truy cập trang này.');
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        showToast.error('Lỗi xác thực', 'Không thể xác thực quyền admin.');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

