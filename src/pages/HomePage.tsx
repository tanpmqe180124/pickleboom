import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import HeaderNew from '@/components/HeaderNew';
import { Banner } from '@/components/BannerHealth';
import FeaturesPage from '@/pages/FeaturesPage';
import { Button } from '@/components/ui/button';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { Users, Building2, Calendar, DollarSign, Search, Shield, Clock, Heart } from 'lucide-react';
import {
  navigateMenu,
  navigationExtra,
  productFilter,
} from '@/constant/navigateMenu';
import { NavChild, NavItem } from '@/types/nav';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

const RenderNavChildren = ({ children }: { children: NavChild[] }) => {
  const [paddingRight, setPaddingRight] = useState<{ [key: string]: string }>(
    {},
  );
  const elementRef = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  const checkPosition = (key: string) => {
    const element = elementRef.current[key];
    if (element) {
      const rect = element.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const isEdge = windowWidth - rect.right < 20;

      setPaddingRight((prev) => ({
        ...prev,
        [key]: isEdge ? '50px' : '',
      }));
    }
  };

  const handleResize = () => {
    Object.keys(elementRef.current).forEach((key) => {
      checkPosition(key);
    });
  };

  useLayoutEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ul>
      {children.map((child) => (
        <li
          key={child.key}
          className="group/ss relative flex w-full items-center justify-center"
        >
          <NavigationMenuLink
            ref={(el) => {
              elementRef.current[child.key] = el;
            }}
            href={child.path}
            className="flex w-full items-center justify-start whitespace-nowrap py-2 pl-7 transition-colors hover:bg-[#EAB308]"
            style={{ paddingRight: paddingRight[child.key] || '140px' }}
          >
            {child.label}
          </NavigationMenuLink>

          {child.children && child.children.length > 0 && (
            <div className="absolute right-0 top-0 hidden min-w-[200px] translate-x-full border-[1px] group-hover/ss:block group-hover:bg-white">
              <RenderNavChildren children={child.children} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

const Home = () => {
  const navItems: NavItem[] = useMemo(() => navigateMenu(), []);
  const specialItems: NavItem[] = useMemo(() => productFilter(), []);
  const extra: NavItem[] = useMemo(() => navigationExtra(), []);

  return (
    <div className="min-h-screen w-full">
      <HeaderNew />
      
      {/* Hero Section - Web trung gian */}
      <div className="relative min-h-screen bg-gradient-to-br from-[#2F3C54] via-[#1E2A3A] to-[#0F1419] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#EAB308] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#FCBA6B] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#EAB308] rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Nền tảng
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] to-[#FCBA6B]">
                Pickleball
              </span>
              <span className="block text-3xl md:text-4xl font-normal mt-2">
                Kết nối sân và người chơi
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Nền tảng trung gian hàng đầu Việt Nam giúp kết nối các sân pickleball 
              với cộng đồng người chơi. Đặt sân dễ dàng, quản lý hiệu quả.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-[#EAB308] hover:bg-[#D4A017] text-[#2F3C54] font-bold px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-[#EAB308]/25 transition-all duration-300 hover:scale-105"
              >
                Tìm sân ngay
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-[#2F3C54] font-bold px-8 py-4 text-lg rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Đăng ký sân
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#EAB308] mb-2">50+</div>
                <div className="text-gray-300 text-lg">Sân đối tác</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#EAB308] mb-2">1000+</div>
                <div className="text-gray-300 text-lg">Người chơi</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#EAB308] mb-2">5000+</div>
                <div className="text-gray-300 text-lg">Lượt đặt sân</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2F3C54] mb-6">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nền tảng pickleball hàng đầu với công nghệ hiện đại và dịch vụ chuyên nghiệp
            </p>
          </div>
          <FeaturesPage />
        </div>
      </div>
      
      {/* CTA Section - Cho cả sân và người chơi */}
      <div className="py-20 bg-gradient-to-r from-[#2F3C54] to-[#1E2A3A]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tham gia cộng đồng Pickleball
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dù bạn là chủ sân hay người chơi, chúng tôi có giải pháp phù hợp cho bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* For Court Owners */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-[#EAB308] rounded-full flex items-center justify-center">
                  <Building2 size={40} color="#2F3C54" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Chủ sân</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Quản lý sân hiệu quả, tăng doanh thu và kết nối với cộng đồng người chơi pickleball
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-gray-300">
                  <Calendar size={20} className="mr-3 text-[#EAB308]" />
                  <span>Quản lý lịch đặt tự động</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <DollarSign size={20} className="mr-3 text-[#EAB308]" />
                  <span>Tăng doanh thu 30%</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users size={20} className="mr-3 text-[#EAB308]" />
                  <span>Tiếp cận 1000+ người chơi</span>
                </div>
              </div>
              <Button 
                className="w-full bg-[#EAB308] hover:bg-[#D4A017] text-[#2F3C54] font-bold py-3 rounded-full"
              >
                Đăng ký sân ngay
              </Button>
            </div>

            {/* For Players */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-[#FCBA6B] rounded-full flex items-center justify-center">
                  <Users size={40} color="#2F3C54" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Người chơi</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Tìm sân gần nhất, đặt lịch dễ dàng và tham gia cộng đồng pickleball sôi động
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-gray-300">
                  <Calendar size={20} className="mr-3 text-[#FCBA6B]" />
                  <span>Đặt sân 24/7 online</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Building2 size={20} className="mr-3 text-[#FCBA6B]" />
                  <span>50+ sân chất lượng</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users size={20} className="mr-3 text-[#FCBA6B]" />
                  <span>Kết nối bạn bè cùng chơi</span>
                </div>
              </div>
              <Button 
                className="w-full bg-[#FCBA6B] hover:bg-[#F4A847] text-[#2F3C54] font-bold py-3 rounded-full"
              >
                Tìm sân ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Health Benefits Banner - Giữ nguyên */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2F3C54] mb-6">
              Lợi ích sức khỏe của Pickleball
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá những lợi ích tuyệt vời mà môn thể thao pickleball mang lại cho sức khỏe của bạn
            </p>
          </div>
          <Banner />
        </div>
      </div>
    </div>
  );
};

export default Home;
