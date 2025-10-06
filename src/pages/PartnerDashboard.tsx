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
import BlogManagement from '@/components/partner/BlogManagement';
import CourtManagement from '@/components/partner/CourtManagement';
import TimeSlotManagement from '@/components/partner/TimeSlotManagement';
import BookingManagement from '@/components/partner/BookingManagement';

type PartnerTab = 'blogs' | 'courts' | 'timeslots' | 'bookings';

const PartnerDashboard: React.FC = () => {
  console.log('=== PARTNER DASHBOARD COMPONENT START ===');
  
  // Simple test first
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="text-white text-4xl font-bold">
        TEST PARTNER DASHBOARD
      </div>
    </div>
  );
  
  // Original code below (commented out for testing)
  /*
  try {
    const { userRole, logout, isAuthenticated } = useAuth();
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
  }, [isPartner]);

  // ========== HANDLE BACK ==========
  const handleBack = () => {
    window.history.back();
  };

  // ========== HANDLE LOGOUT ==========
  const handleLogout = async () => {
    try {
      await logout();
      showToast.success('Đăng xuất thành công', 'Bạn đã đăng xuất khỏi hệ thống partner.');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      showToast.error('Lỗi đăng xuất', 'Có lỗi xảy ra khi đăng xuất.');
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
    console.log('renderTabContent - activeTab:', activeTab);
    try {
      switch (activeTab) {
        case 'blogs':
          console.log('Rendering BlogManagement');
          return <BlogManagement />;
        case 'courts':
          console.log('Rendering CourtManagement');
          return <CourtManagement />;
        case 'timeslots':
          console.log('Rendering TimeSlotManagement');
          return <TimeSlotManagement />;
        case 'bookings':
          console.log('Rendering BookingManagement');
          return <BookingManagement />;
        default:
          console.log('Rendering CourtManagement (default)');
          return <CourtManagement />;
      }
    } catch (error) {
      console.error('Error in renderTabContent:', error);
      return <div className="p-6 text-red-500">Lỗi tải component: {error?.toString()}</div>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!isPartner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-2">Không có quyền truy cập</div>
          <div className="text-gray-600">Bạn không có quyền partner để truy cập trang này.</div>
        </div>
      </div>
    );
  }

  console.log('✅ Rendering Partner Dashboard UI');
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
  } catch (error) {
    console.error('❌ PartnerDashboard Component Error:', error);
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-600 text-2xl font-bold mb-4">Lỗi Component</div>
          <div className="text-gray-700 mb-4">PartnerDashboard component bị lỗi:</div>
          <div className="text-sm text-gray-600 bg-white p-4 rounded border">
            {error?.toString()}
          </div>
        </div>
      </div>
    );
  }
};

export default PartnerDashboard;


