import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import BlogManagement from '@/components/partner/BlogManagement';
import CourtManagement from '@/components/partner/CourtManagement';
import TimeSlotManagement from '@/components/partner/TimeSlotManagement';
import BookingManagement from '@/components/partner/BookingManagement';

type PartnerTab = 'blogs' | 'courts' | 'timeslots' | 'bookings';

const PartnerDashboard: React.FC = () => {
  try {
    console.log('=== PARTNER DASHBOARD COMPONENT START ===');
    
    const { userRole, logout, isAuthenticated } = useAuth();
    const showToast = useToast();
    const [activeTab, setActiveTab] = useState<PartnerTab>('courts');

    const isPartner = userRole === 'Partner' || userRole?.toLowerCase() === 'partner';
    
    console.log('PartnerDashboard - userRole:', userRole);
    console.log('PartnerDashboard - isPartner:', isPartner);
    console.log('PartnerDashboard - isAuthenticated:', isAuthenticated);
    console.log('PartnerDashboard - activeTab:', activeTab);
  
    // ========== CHECK PARTNER ROLE ==========
    useEffect(() => {
      if (!isPartner) {
        showToast.error('Không có quyền truy cập', 'Bạn không có quyền partner để truy cập trang này.');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    }, [isPartner, showToast]);

    // ========== HANDLE BACK ==========
    const handleBack = () => {
      window.history.back();
    };

    // ========== HANDLE LOGOUT ==========
    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    // ========== RENDER TAB CONTENT ==========
    const renderTabContent = () => {
      try {
        console.log('PartnerDashboard - renderTabContent - activeTab:', activeTab);
        switch (activeTab) {
          case 'blogs':
            return <BlogManagement />;
          case 'courts':
            return <CourtManagement />;
          case 'timeslots':
            return <TimeSlotManagement />;
          case 'bookings':
            return <BookingManagement />;
          default:
            return <CourtManagement />;
        }
      } catch (error) {
        console.error('❌ PartnerDashboard - renderTabContent Error:', error);
        return (
          <div className="text-red-500 p-4">
            <p>Đã xảy ra lỗi khi hiển thị nội dung. Vui lòng thử lại.</p>
            <p>Chi tiết lỗi: {error instanceof Error ? error.message : String(error)}</p>
          </div>
        );
      }
    };

    // ========== AUTHENTICATION CHECK ==========
    if (!isAuthenticated) {
      console.log('PartnerDashboard - Rendering "Đang xác thực..."');
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p className="text-lg text-gray-700">Đang xác thực...</p>
        </div>
      );
    }

    if (!isPartner) {
      console.log('PartnerDashboard - Rendering "Không có quyền truy cập"');
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-100">
          <p className="text-lg text-red-700">Bạn không có quyền truy cập trang này.</p>
        </div>
      );
    }

    console.log('PartnerDashboard - Rendering main dashboard UI.');
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('courts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'courts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Quản lý Sân
              </button>
              <button
                onClick={() => setActiveTab('timeslots')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'timeslots'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Quản lý Khung giờ
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Quản lý Đặt sân
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'blogs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Quản lý Blog
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ PartnerDashboard Component Error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-200">
        <div className="text-center">
          <p className="text-lg text-red-800 font-semibold mb-2">
            Đã xảy ra lỗi nghiêm trọng
          </p>
          <p className="text-red-600">
            Chi tiết lỗi: {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </div>
    );
  }
};

export default PartnerDashboard;