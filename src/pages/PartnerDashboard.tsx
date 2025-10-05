import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/utils/toastManager';
import { 
  MapPin, 
  Clock, 
  FileText, 
  Calendar,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';

// ========== COMPONENT IMPORTS ==========
import CourtManagement from '@/components/admin/CourtManagement';
import TimeSlotManagement from '@/components/partner/TimeSlotManagement';
import BlogManagement from '@/components/admin/BlogManagement';
import BookingManagement from '@/components/admin/BookingManagement';

type PartnerTab = 'courts' | 'timeslots' | 'blogs' | 'bookings';

const PartnerDashboard: React.FC = () => {
  const { userRole, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<PartnerTab>('courts');

  const isPartner = userRole === 'partner' || userRole?.toLowerCase() === 'partner';
  
  console.log('PartnerDashboard - userRole:', userRole);
  console.log('PartnerDashboard - userRole type:', typeof userRole);
  console.log('PartnerDashboard - userRole.toLowerCase():', userRole?.toLowerCase());
  console.log('PartnerDashboard - isPartner:', isPartner);
  
  // ========== CHECK PARTNER ROLE ==========
  useEffect(() => {
    if (!isPartner) {
      showToast.error('Không có quyền truy cập', 'Bạn không có quyền partner để truy cập trang này.');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    }
  }, [isPartner]);

  // ========== HANDLERS ==========
  const handleLogout = () => {
    logout();
    showToast.success('Đăng xuất thành công', 'Bạn đã đăng xuất khỏi hệ thống.');
  };

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // ========== NAVIGATION ITEMS ==========
  const navigationItems = [
    {
      id: 'courts' as PartnerTab,
      label: 'Quản lý sân Pickleball',
      icon: MapPin,
      description: 'Quản lý sân bóng và thông tin chi tiết'
    },
    {
      id: 'timeslots' as PartnerTab,
      label: 'Quản lý khung giờ',
      icon: Clock,
      description: 'Thiết lập khung giờ hoạt động'
    },
    {
      id: 'blogs' as PartnerTab,
      label: 'Quản lý blog',
      icon: FileText,
      description: 'Tạo và quản lý bài viết blog'
    },
    {
      id: 'bookings' as PartnerTab,
      label: 'Quản lý đặt sân',
      icon: Calendar,
      description: 'Xem và quản lý lịch đặt sân'
    }
  ];

  // ========== RENDER CONTENT ==========
  const renderContent = () => {
    switch (activeTab) {
      case 'courts':
        return <CourtManagement />;
      case 'timeslots':
        return <TimeSlotManagement />;
      case 'blogs':
        return <BlogManagement />;
      case 'bookings':
        return <BookingManagement />;
      default:
        return <CourtManagement />;
    }
  };

  // ========== LOADING STATE ==========
  if (!isPartner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== HEADER ========== */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="Quay lại Dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Quản lý sân bóng
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ========== SIDEBAR NAVIGATION ========== */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ========== MAIN CONTENT ========== */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm border">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
