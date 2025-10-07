import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
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
import BlogManagement from '@/components/partner/BlogManagement';
import CourtManagement from '@/components/partner/CourtManagement';
import TimeSlotManagement from '@/components/partner/TimeSlotManagement';
import BookingManagement from '@/components/partner/BookingManagement';

type PartnerTab = 'blogs' | 'courts' | 'timeslots' | 'bookings';

const PartnerDashboard: React.FC = () => {
  const { userRole, logout, isAuthenticated } = useAuth();
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState<PartnerTab>('courts');

  const isPartner = userRole === 'Partner' || userRole?.toLowerCase() === 'partner';
  
  console.log('PartnerDashboard - userRole:', userRole);
  console.log('PartnerDashboard - isPartner:', isPartner);
  
  // Show loading if still checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // ========== CHECK PARTNER ROLE ==========
  useEffect(() => {
    console.log('PartnerDashboard useEffect - isPartner:', isPartner);
    console.log('PartnerDashboard useEffect - userRole:', userRole);
    if (!isPartner) {
      console.log('❌ Not partner, showing error and redirecting');
      showToast.showError('Không có quyền truy cập', 'Bạn không có quyền partner để truy cập trang này.');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } else {
      console.log('✅ Partner access confirmed');
    }
  }, [isPartner, showToast]);

  // Show access denied if not partner
  if (!isPartner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h2>
          <p className="text-gray-600 mb-4">Bạn không có quyền partner để truy cập trang này.</p>
          <p className="text-sm text-gray-500">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  // ========== HANDLE BACK ==========
  const handleBack = () => {
    window.history.back();
  };

  // ========== HANDLE LOGOUT ==========
  const handleLogout = async () => {
    try {
      await logout();
      showToast.showSuccess('Đăng xuất thành công', 'Bạn đã đăng xuất khỏi hệ thống partner.');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      showToast.showError('Lỗi đăng xuất', 'Có lỗi xảy ra khi đăng xuất.');
    }
  };

  // ========== TAB CONFIGURATION ==========
  const tabs = [
    {
      id: 'blogs' as PartnerTab,
      name: 'Quản lý blog',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100'
    },
    {
      id: 'courts' as PartnerTab,
      name: 'Quản lý sân Pickleball',
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 'timeslots' as PartnerTab,
      name: 'Quản lý khung giờ',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      id: 'bookings' as PartnerTab,
      name: 'Quản lý đặt sân',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    }
  ];

  // ========== RENDER TAB CONTENT ==========
  const renderTabContent = () => {
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
  };

  if (!isPartner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Partner Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? `${tab.bgColor} ${tab.color} shadow-sm`
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <div>
                      <div className="font-medium">{tab.name}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;


