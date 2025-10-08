import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/utils/toastManager';
import { 
  Users, 
  UserPlus,
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
import UserManagement from '@/components/admin/UserManagement';
import PartnerManagement from '@/components/admin/PartnerManagement';
import CourtManagement from '@/components/admin/CourtManagement';
import TimeSlotManagement from '@/components/admin/TimeSlotManagement';
import BlogManagement from '@/components/admin/BlogManagement';
import BookingManagement from '@/components/admin/BookingManagement';

type AdminTab = 'users' | 'partners' | 'courts' | 'timeslots' | 'blogs' | 'bookings';

const AdminDashboard: React.FC = () => {
  const { userRole, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  const isAdmin = userRole === 'Admin' || userRole?.toLowerCase() === 'admin';
  
  console.log('AdminDashboard - userRole:', userRole);
  console.log('AdminDashboard - userRole type:', typeof userRole);
  console.log('AdminDashboard - userRole.toLowerCase():', userRole?.toLowerCase());
  console.log('AdminDashboard - isAdmin:', isAdmin);
  
  // ========== CHECK ADMIN ROLE ==========
  useEffect(() => {
    if (!isAdmin) {
      showToast.error('Không có quyền truy cập', 'Bạn không có quyền admin để truy cập trang này.');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    }
  }, [isAdmin]);

  // ========== HANDLE BACK ==========
  const handleBack = () => {
    window.history.back();
  };

  // ========== HANDLE LOGOUT ==========
  const handleLogout = async () => {
    try {
      await logout();
      showToast.success('Đăng xuất thành công', 'Bạn đã đăng xuất khỏi hệ thống admin.');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      showToast.error('Lỗi đăng xuất', 'Có lỗi xảy ra khi đăng xuất.');
    }
  };

  // ========== TAB CONFIGURATION ==========
  const tabs = [
    {
      id: 'users' as AdminTab,
      name: 'Quản lý người dùng',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'partners' as AdminTab,
      name: 'Quản lý Partner',
      icon: UserPlus,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      id: 'courts' as AdminTab,
      name: 'Quản lý sân Pickleball',
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 'timeslots' as AdminTab,
      name: 'Quản lý khung giờ',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      id: 'blogs' as AdminTab,
      name: 'Quản lý blog',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100'
    },
    {
      id: 'bookings' as AdminTab,
      name: 'Quản lý đặt sân',
      icon: Calendar,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    }
  ];

  // ========== RENDER ACCESS DENIED ==========
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <EyeOff className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h1>
          <p className="text-gray-600 mb-4">Bạn không có quyền admin để truy cập trang này.</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay về Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ========== RENDER ADMIN DASHBOARD ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* ========== HEADER ========== */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Quay lại trang trước"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-3">
                <Settings className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Admin
                </p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ========== SIDEBAR ========== */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? `${tab.bgColor} ${tab.color} border-l-4 border-current`
                        : `text-gray-600 hover:bg-gray-100 ${tab.hoverColor}`
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ========== MAIN CONTENT ========== */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {/* ========== TAB CONTENT ========== */}
              <div className="p-6">
                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'partners' && <PartnerManagement />}
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

export default AdminDashboard;

