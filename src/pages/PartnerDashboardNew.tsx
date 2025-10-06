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
  ArrowLeft,
  Trophy,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';

// ========== COMPONENT IMPORTS ==========
import BlogManagement from '@/components/partner/BlogManagement';
import CourtManagement from '@/components/partner/CourtManagement';
import TimeSlotManagement from '@/components/partner/TimeSlotManagement';
import BookingManagement from '@/components/partner/BookingManagement';

type PartnerTab = 'overview' | 'courts' | 'timeslots' | 'bookings' | 'blogs';

const PartnerDashboardNew: React.FC = () => {
  const { userRole, logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<PartnerTab>('overview');

  const isPartner = userRole === 'partner' || userRole?.toLowerCase() === 'partner';
  
  console.log('PartnerDashboardNew - userRole:', userRole);
  console.log('PartnerDashboardNew - isPartner:', isPartner);
  
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
      id: 'overview' as PartnerTab,
      name: 'Tổng quan',
      icon: BarChart3,
      bgColor: 'bg-blue-50',
      color: 'text-blue-700'
    },
    {
      id: 'courts' as PartnerTab,
      name: 'Quản lý sân',
      icon: MapPin,
      bgColor: 'bg-green-50',
      color: 'text-green-700'
    },
    {
      id: 'timeslots' as PartnerTab,
      name: 'Quản lý khung giờ',
      icon: Clock,
      bgColor: 'bg-purple-50',
      color: 'text-purple-700'
    },
    {
      id: 'bookings' as PartnerTab,
      name: 'Quản lý đặt sân',
      icon: Calendar,
      bgColor: 'bg-orange-50',
      color: 'text-orange-700'
    },
    {
      id: 'blogs' as PartnerTab,
      name: 'Quản lý blog',
      icon: FileText,
      bgColor: 'bg-pink-50',
      color: 'text-pink-700'
    }
  ];

  // ========== RENDER TAB CONTENT ==========
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab user={user} />;
      case 'courts':
        return <CourtManagement />;
      case 'timeslots':
        return <TimeSlotManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'blogs':
        return <BlogManagement />;
      default:
        return <OverviewTab user={user} />;
    }
  };

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
              <div className="text-sm text-gray-600">
                Xin chào, <span className="font-medium">{user?.fullName || 'Partner'}</span>
              </div>
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

// ========== OVERVIEW TAB COMPONENT ==========
const OverviewTab: React.FC<{ user: any }> = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Chào mừng trở lại, {user?.fullName || 'Partner'}!
              </h2>
              <p className="text-blue-100 mb-4">
                Sẵn sàng cho một trận đấu pickleball tuyệt vời?
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>{formatTime(currentTime)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{formatDate(currentTime)}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Trophy size={48} className="text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lần chơi tháng này</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-green-600">+3 từ tuần trước</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Trophy size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sân yêu thích</p>
              <p className="text-lg font-bold text-gray-900">Sân A</p>
              <p className="text-sm text-blue-600">Thường xuyên</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPin size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số lần chơi</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
              <p className="text-sm text-purple-600">Tất cả thời gian</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Thời gian chơi</p>
              <p className="text-2xl font-bold text-gray-900">94</p>
              <p className="text-sm text-orange-600">Giờ</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Plus size={20} className="text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-blue-900">Đặt lịch mới</div>
              <div className="text-sm text-blue-600">Đặt sân chơi pickleball</div>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Calendar size={20} className="text-green-600" />
            <div className="text-left">
              <div className="font-medium text-green-900">Lịch sử đặt sân</div>
              <div className="text-sm text-green-600">Xem các lần đặt sân trước</div>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Users size={20} className="text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-purple-900">Quản lý tài khoản</div>
              <div className="text-sm text-purple-600">Cập nhật thông tin cá nhân</div>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} className="text-gray-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Cài đặt</div>
              <div className="text-sm text-gray-600">Tùy chỉnh ứng dụng</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent History */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử gần đây</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <MapPin size={20} className="text-gray-600" />
              <div>
                <div className="font-medium">Sân A - 15:00</div>
                <div className="text-sm text-gray-600">Hôm nay</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Hoàn thành
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <MapPin size={20} className="text-gray-600" />
              <div>
                <div className="font-medium">Sân B - 10:00</div>
                <div className="text-sm text-gray-600">Hôm qua</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
              Đang chờ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboardNew;
