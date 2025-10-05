import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  User, 
  Calendar, 
  Clock, 
  Trophy, 
  Settings, 
  LogOut, 
  Plus,
  TrendingUp,
  Users,
  MapPin
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/infrastructure/storage/tokenStorage';
import { useBookingStore } from '@/stores/useBookingStore';
import { useEffect, useState } from 'react';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { userService } from '@/services/userService';
import AdminLink from '@/components/AdminLink';
import PartnerLink from '@/components/PartnerLink';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user, setUser } = useAuthStore();
  const resetBooking = useBookingStore((state) => state.resetBooking);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userInfo, setUserInfo] = useState<any>(null);
  
  // Animation refs
  const [headerRef, headerInView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [statsRef, statsInView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [actionsRef, actionsInView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [activityRef, activityInView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [personalRef, personalInView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.1 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load user info when component mounts
  useEffect(() => {
    const loadUserInfo = async () => {
      if (user?.userId && !user?.fullName) {
        try {
          console.log('Loading user info for userId:', user.userId);
          const userData = await userService.getUserById(user.userId);
          console.log('User data loaded:', userData);
          setUserInfo(userData);
          
          // Update user in store with full info
          const updatedUser = {
            ...user,
            fullName: userData.FullName || userData.fullName,
            avatar: userData.Avatar || userData.avatar,
            role: userData.Status === 1 ? 'user' : 'admin'
          };
          console.log('Updating user with:', updatedUser);
          setUser(updatedUser);
        } catch (error) {
          console.error('Error loading user info:', error);
        }
      }
    };

    loadUserInfo();
  }, [user?.userId, user?.fullName, setUser]);

  const handleLogout = async () => {
    resetBooking();
    await logout();
    navigate('/login');
  };

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

  const quickActions = [
    {
      title: 'Đặt lịch mới',
      description: 'Đặt sân chơi pickleball',
      icon: Plus,
      action: () => navigate('/PlayerType'),
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'Lịch sử đặt sân',
      description: 'Xem các lần đặt sân trước',
      icon: Calendar,
      action: () => navigate('/booking-history'),
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: 'Quản lý tài khoản',
      description: 'Cập nhật thông tin cá nhân',
      icon: User,
      action: () => navigate('/profile'),
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'Cài đặt',
      description: 'Tùy chỉnh ứng dụng',
      icon: Settings,
      action: () => navigate('/settings'),
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600'
    }
  ];

  const stats = [
    {
      title: 'Lần chơi tháng này',
      value: '12',
      change: '+3',
      changeType: 'positive',
      icon: Trophy
    },
    {
      title: 'Sân yêu thích',
      value: 'Sân A',
      change: 'Thường xuyên',
      changeType: 'neutral',
      icon: MapPin
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div 
        ref={headerRef}
        className={`bg-white shadow-sm border-b transition-all duration-700 transform ${
          headerInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
      <button
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        onClick={() => navigate('/')}
        title="Về trang chủ"
      >
                <ChevronLeft size={20} />
      </button>
              <div>
                <h1 className="text-2xl font-sport text-gray-900">Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <AdminLink />
              <PartnerLink />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName || userInfo?.fullName || 'Người dùng'}
                </p>
              </div>
              <div 
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all duration-200"
                onClick={() => navigate('/profile')}
                title="Xem hồ sơ cá nhân"
              >
                {user?.avatar || userInfo?.avatar ? (
                  <img
                    src={user?.avatar || userInfo?.avatar}
                    alt={user?.fullName || userInfo?.fullName || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {(user?.fullName || userInfo?.fullName || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div 
          ref={headerRef}
          className={`mb-8 transition-all duration-700 transform ${
            headerInView 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-sport mb-2 animate-fade-in">
                    Chào mừng trở lại, {user?.fullName || userInfo?.fullName || 'Người chơi'}! 
            </h2>
                  <p className="text-blue-100 mb-4 animate-fade-in">
                    Sẵn sàng cho một trận đấu pickleball tuyệt vời?
                  </p>
                  <div className="flex items-center space-x-6 text-sm animate-fade-in">
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
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <Trophy size={40} className="animate-bounce" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div 
          ref={statsRef}
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 transition-all duration-700 transform ${
            statsInView 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                statsInView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 animate-fade-in">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${
                    stat.changeType === 'positive' ? 'bg-green-100' : 
                    stat.changeType === 'negative' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <stat.icon size={24} className={
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    } />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div 
          ref={actionsRef}
          className={`mb-8 transition-all duration-700 transform ${
            actionsInView 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <h3 className="text-xl font-heading text-gray-900 mb-6">Thao tác nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                  actionsInView 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={action.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.color} ${action.hoverColor} transition-all duration-300 transform hover:scale-110`}>
                      <action.icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading text-gray-900 min-h-[2.5rem] flex items-center leading-tight">{action.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div 
          ref={activityRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-700 transform ${
            activityInView 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Recent Bookings */}
          <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar size={20} />
                <span>Lịch sử gần đây</span>
              </CardTitle>
              <CardDescription>
                Các lần đặt sân gần nhất của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Sân A - 15:00</p>
                    <p className="text-sm text-gray-600">Hôm nay</p>
                  </div>
                  <Badge variant="default">Hoàn thành</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Sân B - 10:00</p>
                    <p className="text-sm text-gray-600">Hôm qua</p>
                  </div>
                  <Badge variant="secondary">Đang chờ</Badge>
                </div>
                <div className="text-center py-4">
                  <Button variant="outline" className="w-full">
                    Xem tất cả lịch sử
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card 
            ref={personalRef}
            className={`hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
              personalInView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp size={20} />
                <span>Thống kê cá nhân</span>
              </CardTitle>
              <CardDescription>
                Tổng quan hoạt động của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng số lần chơi</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Thời gian chơi (giờ)</span>
                  <span className="font-semibold">94</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sân yêu thích</span>
                  <span className="font-semibold">Sân A</span>
                </div>
                <div className="pt-4 border-t">
          <Button
                    variant="outline" 
                    className="w-full"
            onClick={handleLogout}
          >
                    <LogOut size={16} className="mr-2" />
            Đăng xuất
          </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
