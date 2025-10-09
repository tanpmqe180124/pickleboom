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
  const { userRole, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<PartnerTab>('courts');

  const isPartner = userRole === 'Partner' || userRole?.toLowerCase() === 'partner';
  
  console.log('PartnerDashboard - userRole:', userRole);
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
      id: 'blogs' as PartnerTab,
      name: 'Quản lý blog',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100'
    },
    {
      id: 'bookings' as PartnerTab,
      name: 'Quản lý đặt sân',
      icon: Calendar,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    }
  ];

  // ========== RENDER ACCESS DENIED ==========
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ========== HEADER ========== */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
                  <p className="text-sm text-gray-500">Quản lý sân Pickleball của bạn</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Partner</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md font-medium"
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ========== SIDEBAR ========== */}
          <div className="lg:w-72">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
                Quản lý
              </h2>
              <nav className="space-y-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-200 group ${
                        isActive
                          ? `${tab.bgColor} ${tab.color} border-l-4 border-current shadow-md transform scale-[1.02]`
                          : `text-gray-600 hover:bg-gray-50 ${tab.hoverColor} hover:shadow-sm hover:transform hover:scale-[1.01]`
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive ? 'bg-white bg-opacity-50' : 'bg-gray-100 group-hover:bg-white group-hover:bg-opacity-50'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{tab.name}</span>
                        <p className="text-xs text-gray-500 mt-1">
                          {tab.id === 'courts' && 'Quản lý sân bóng'}
                          {tab.id === 'timeslots' && 'Quản lý khung giờ'}
                          {tab.id === 'blogs' && 'Quản lý bài viết'}
                          {tab.id === 'bookings' && 'Quản lý đặt sân'}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* ========== MAIN CONTENT ========== */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* ========== TAB CONTENT ========== */}
              <div className="p-8">
                {activeTab === 'courts' && <CourtManagement />}
                {activeTab === 'timeslots' && <TimeSlotManagement />}
                {activeTab === 'blogs' && <BlogManagement />}
                {activeTab === 'bookings' && <BookingManagement />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;