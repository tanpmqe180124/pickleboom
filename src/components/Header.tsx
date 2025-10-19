import { UserRound, Calendar, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthStore } from '@/infrastructure/storage/tokenStorage';
import { useState } from 'react';

const Header = () => {
  const { userID, accessToken, logout } = useAuth();
  const { user } = useAuthStore();
  const isAuthenticated = !!accessToken;
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <header className="h-[100px] border-b bg-primary text-primary-foreground sticky top-0 z-50 backdrop-blur-sm bg-primary/95">
      <div className="w-full py-3">
        {/* Enhanced Top utility bar */}
        <div className="mr-2 flex items-center justify-center divide-x divide-muted-foreground/30">
          <div className="flex space-x-1 px-4">
            <span className="cursor-pointer text-sm hover:text-primary-hl transition-colors duration-200 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Đặt sân online
            </span>
          </div>
          <div className="flex space-x-1 px-4">
            <span className="cursor-pointer text-sm hover:text-primary-hl transition-colors duration-200 flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Hotline: 0389145575 (9h-23h)
            </span>
          </div>
          <div className="flex space-x-1 px-4">
            <span className="cursor-pointer text-sm hover:text-primary-hl transition-colors duration-200 flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              Hoạt động 24/7
            </span>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex w-full flex-wrap">
          <div className="grid w-full grid-cols-12">
            <div className="col-span-3 flex items-center justify-center">
              <Link 
                to="/" 
                className="transition-all duration-200 hover:scale-105 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-hl focus:ring-offset-2 rounded-lg p-2 -m-2"
                title="Về trang chủ PickleBoom"
                aria-label="Về trang chủ PickleBoom"
              >
                <img
                  src="/img/brandlogo_white_clean.png"
                  className="h-[63px] w-[112px] object-contain cursor-pointer"
                  alt="Pickle Boom Logo - Nhấn để về trang chủ"
                />
              </Link>
            </div>
            <div className="col-span-6 flex items-center justify-center">
              <nav className="flex space-x-8">
                <Link
                  to="/playertype"
                  className="text-lg font-medium hover:text-primary-hl transition-all duration-300 relative group"
                >
                  <span className="relative z-10">SÂN PICKLEBALL</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-hl transition-all duration-300 group-hover:w-full"></div>
                </Link>
                <Link
                  to="/home"
                  className="text-lg font-medium hover:text-primary-hl transition-all duration-300 relative group"
                >
                  <span className="relative z-10">TRANG CHỦ</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-hl transition-all duration-300 group-hover:w-full"></div>
                </Link>
                <Link
                  to="/blog"
                  className="text-lg font-medium hover:text-primary-hl transition-all duration-300 relative group"
                >
                  <span className="relative z-10">TIN TỨC & KHUYẾN MÃI</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-hl transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </nav>
            </div>
            <div className="col-span-3 flex items-center justify-center space-x-4">
              <Button
                asChild
                variant="outline"
                className="border-primary-hl text-primary-hl hover:bg-primary-hl hover:text-primary"
              >
                <Link to="/playertype">Đặt lịch ngay</Link>
              </Button>
              {isAuthenticated ? (
                <div className="relative">
                  <Button
                    variant="outline"
                    className="border-primary-hl text-primary-hl hover:bg-primary-hl hover:text-primary"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <UserRound className="mr-2 h-4 w-4" />
                    {user?.fullName || 'Tài khoản'}
                  </Button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-[9999]">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserRound className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="border-primary-hl text-primary-hl hover:bg-primary-hl hover:text-primary"
                >
                  <Link to="/login">Đăng nhập</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;