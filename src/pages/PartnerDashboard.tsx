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
  BarChart3,
  MoreHorizontal
} from 'lucide-react';

// ========== COMPONENT IMPORTS ==========
import BlogManagement from '@/components/partner/BlogManagement';
import CourtManagement from '@/components/partner/CourtManagement';
import TimeSlotManagement from '@/components/partner/TimeSlotManagement';
import BookingManagement from '@/components/partner/BookingManagement';

type PartnerTab = 'overview' | 'courts' | 'timeslots' | 'bookings' | 'blogs';

const PartnerDashboard: React.FC = () => {
  const { userRole, logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<PartnerTab>('overview');

  const isPartner = userRole === 'partner' || userRole?.toLowerCase() === 'partner';
  
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
  const [stats, setStats] = useState({
    totalCourts: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeTimeSlots: 0
  });

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
              <p className="text-sm font-medium text-gray-600">Tổng số sân</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourts}</p>
              <p className="text-sm text-green-600">Đang hoạt động</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <MapPin size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đặt sân hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              <p className="text-sm text-blue-600">Lượt đặt</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Doanh thu tháng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()}đ</p>
              <p className="text-sm text-purple-600">VND</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Khung giờ hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeTimeSlots}</p>
              <p className="text-sm text-orange-600">Khung giờ</p>
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
          <button 
            onClick={() => window.location.href = '/partner?tab=courts'}
            className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Plus size={20} className="text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-blue-900">Thêm sân mới</div>
              <div className="text-sm text-blue-600">Tạo sân pickleball mới</div>
            </div>
          </button>

          <button 
            onClick={() => window.location.href = '/partner?tab=timeslots'}
            className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Clock size={20} className="text-green-600" />
            <div className="text-left">
              <div className="font-medium text-green-900">Quản lý khung giờ</div>
              <div className="text-sm text-green-600">Thiết lập thời gian hoạt động</div>
            </div>
          </button>

          <button 
            onClick={() => window.location.href = '/partner?tab=bookings'}
            className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Calendar size={20} className="text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-purple-900">Xem đặt sân</div>
              <div className="text-sm text-purple-600">Quản lý lịch đặt sân</div>
            </div>
          </button>

          <button 
            onClick={() => window.location.href = '/partner?tab=blogs'}
            className="flex items-center space-x-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
          >
            <FileText size={20} className="text-pink-600" />
            <div className="text-left">
              <div className="font-medium text-pink-900">Viết blog</div>
              <div className="text-sm text-pink-600">Chia sẻ kinh nghiệm</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <MapPin size={20} className="text-gray-600" />
              <div>
                <div className="font-medium">Sân A - 15:00</div>
                <div className="text-sm text-gray-600">Đặt sân mới hôm nay</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Hoàn thành
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock size={20} className="text-gray-600" />
              <div>
                <div className="font-medium">Khung giờ 09:00-10:00</div>
                <div className="text-sm text-gray-600">Thêm khung giờ mới</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Mới
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText size={20} className="text-gray-600" />
              <div>
                <div className="font-medium">Blog: Hướng dẫn chơi pickleball</div>
                <div className="text-sm text-gray-600">Đã xuất bản</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              Xuất bản
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;