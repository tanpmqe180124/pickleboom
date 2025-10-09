import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import HeaderNew from '@/components/HeaderNew';
import { Banner } from '@/components/BannerHealth';
import { BlogCard } from '@/components/Blog';
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
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-black text-white mb-4 leading-none tracking-tight">
                Nền tảng
              </h1>
              <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] via-[#FCBA6B] to-[#EAB308] mb-6 leading-none tracking-tight">
                Pickleball
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-wide">
                Kết nối sân và người chơi
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
              Nền tảng trung gian hàng đầu tại Quy Nhơn giúp kết nối các sân pickleball 
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
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#2F3C54] font-bold px-8 py-4 text-lg rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
                style={{ 
                  color: 'white',
                  backgroundColor: 'transparent',
                  borderColor: 'white'
                }}
              >
                Đăng ký sân
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-black text-[#EAB308] mb-4 tracking-tight">50+</div>
                <div className="text-gray-200 text-xl font-medium tracking-wide">Sân đối tác</div>
              </div>
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-black text-[#EAB308] mb-4 tracking-tight">1000+</div>
                <div className="text-gray-200 text-xl font-medium tracking-wide">Người chơi</div>
              </div>
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-black text-[#EAB308] mb-4 tracking-tight">5000+</div>
                <div className="text-gray-200 text-xl font-medium tracking-wide">Lượt đặt sân</div>
              </div>
            </div>
          </div>
        </div>
                        </div>
      
      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-[#2F3C54] mb-6 tracking-tight">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
              Nền tảng pickleball hàng đầu với công nghệ hiện đại và dịch vụ chuyên nghiệp
            </p>
          </div>
          <FeaturesPage />
        </div>
      </div>
      
      {/* CTA Section - Cho cả sân và người chơi */}
      <div className="py-24 bg-gradient-to-r from-[#2F3C54] to-[#1E2A3A]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Tham gia cộng đồng Pickleball
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
              Dù bạn là chủ sân hay người chơi, chúng tôi có giải pháp phù hợp cho bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* For Court Owners */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-[#EAB308] rounded-full flex items-center justify-center shadow-2xl">
                  <Building2 size={48} color="#2F3C54" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-6 text-center tracking-tight">Chủ sân</h3>
              <p className="text-lg text-gray-200 mb-8 leading-relaxed text-center font-light tracking-wide">
                Quản lý sân hiệu quả, tăng doanh thu và kết nối với cộng đồng người chơi pickleball
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center text-gray-200 text-lg">
                  <Calendar size={24} className="mr-4 text-[#EAB308]" />
                  <span className="font-medium">Quản lý lịch đặt tự động</span>
                </div>
                <div className="flex items-center text-gray-200 text-lg">
                  <DollarSign size={24} className="mr-4 text-[#EAB308]" />
                  <span className="font-medium">Tăng doanh thu 30%</span>
                </div>
                <div className="flex items-center text-gray-200 text-lg">
                  <Users size={24} className="mr-4 text-[#EAB308]" />
                  <span className="font-medium">Tiếp cận 1000+ người chơi</span>
                </div>
              </div>
              <Button 
                className="w-full bg-[#EAB308] hover:bg-[#D4A017] text-[#2F3C54] font-bold py-3 rounded-full"
              >
                Đăng ký sân ngay
              </Button>
            </div>

            {/* For Players */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-[#FCBA6B] rounded-full flex items-center justify-center shadow-2xl">
                  <Users size={48} color="#2F3C54" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-6 text-center tracking-tight">Người chơi</h3>
              <p className="text-lg text-gray-200 mb-8 leading-relaxed text-center font-light tracking-wide">
                Tìm sân gần nhất, đặt lịch dễ dàng và tham gia cộng đồng pickleball sôi động
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center text-gray-200 text-lg">
                  <Calendar size={24} className="mr-4 text-[#FCBA6B]" />
                  <span className="font-medium">Đặt sân 24/7 online</span>
                </div>
                <div className="flex items-center text-gray-200 text-lg">
                  <Building2 size={24} className="mr-4 text-[#FCBA6B]" />
                  <span className="font-medium">50+ sân chất lượng</span>
                </div>
                <div className="flex items-center text-gray-200 text-lg">
                  <Users size={24} className="mr-4 text-[#FCBA6B]" />
                  <span className="font-medium">Kết nối bạn bè cùng chơi</span>
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
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-[#2F3C54] mb-6 tracking-tight">
              Lợi ích sức khỏe của Pickleball
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
              Khám phá những lợi ích tuyệt vời mà môn thể thao pickleball mang lại cho sức khỏe của bạn
            </p>
          </div>
          <Banner />
        </div>
      </div>
      
      {/* Blog Section - Thêm lại */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-[#2F3C54] mb-6 tracking-tight">
              BLOG & TIN TỨC
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
              Cập nhật tin tức mới nhất về pickleball và cộng đồng
            </p>
          </div>
          <BlogCard />
        </div>
      </div>
    </div>
  );
};

export default Home;
