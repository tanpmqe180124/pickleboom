import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { Banner } from '@/components/BannerHealth';
import { BlogCard } from '@/components/Blog';
import FeaturesPage from '@/pages/FeaturesPage';
import TestimonialsSection from '@/components/TestimonialsSection';
import { FAQSection, Footer } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { Users, Building2, Calendar, DollarSign, Search, Shield, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const navItems: NavItem[] = useMemo(() => navigateMenu(), []);
  const specialItems: NavItem[] = useMemo(() => productFilter(), []);
  const extra: NavItem[] = useMemo(() => navigationExtra(), []);

  const handleFindCourt = () => {
    navigate('/playertype');
  };

  const handleRegisterCourt = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full">
      <Header />
      <HeroSection />
      
      {/* Features Section */}
      <motion.div 
        className="py-24 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-[#2F3C54] mb-6 tracking-tight">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
              Nền tảng pickleball hàng đầu với công nghệ hiện đại và dịch vụ chuyên nghiệp
            </p>
          </motion.div>
          <FeaturesPage />
          </div>
      </motion.div>
      
      {/* CTA Section - Cho cả sân và người chơi */}
      <motion.div 
        className="py-24 bg-gradient-to-r from-[#2F3C54] to-[#1E2A3A]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Tham gia cộng đồng Pickleball
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
              Dù bạn là chủ sân hay người chơi, chúng tôi có giải pháp phù hợp cho bạn
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* For Court Owners */}
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:bg-white/20 transition-all duration-300"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
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
                  <span className="font-medium">Tiếp cận 100+ người chơi</span>
                </div>
              </div>
              <Button 
                className="w-full bg-[#EAB308] hover:bg-[#D4A017] text-[#2F3C54] font-bold py-3 rounded-full"
                onClick={handleRegisterCourt}
              >
                Đăng ký sân ngay
              </Button>
            </motion.div>

            {/* For Players */}
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:bg-white/20 transition-all duration-300"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
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
                  <span className="font-medium">10+ sân chất lượng</span>
                </div>
                <div className="flex items-center text-gray-200 text-lg">
                  <Users size={24} className="mr-4 text-[#FCBA6B]" />
                  <span className="font-medium">Kết nối bạn bè cùng chơi</span>
                </div>
          </div>
              <Button 
                className="w-full bg-[#FCBA6B] hover:bg-[#F4A847] text-[#2F3C54] font-bold py-3 rounded-full"
                onClick={handleFindCourt}
              >
                Tìm sân ngay
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Health Benefits Banner - Giữ nguyên */}
      <motion.div 
        className="py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-[#2F3C54] mb-6 tracking-tight">
              Lợi ích sức khỏe của Pickleball
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
              Khám phá những lợi ích tuyệt vời mà môn thể thao pickleball mang lại cho sức khỏe của bạn
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Banner />
          </motion.div>
      </div>
      </motion.div>
      
      {/* Blog Section - Thêm lại */}
      <motion.div 
        className="py-24 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-[#2F3C54] mb-6 tracking-tight">
              BLOG & TIN TỨC
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
              Cập nhật tin tức mới nhất về pickleball và cộng đồng
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <BlogCard />
          </motion.div>
        </div>
      </motion.div>
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
