import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import Header from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CTASection } from '@/components/CTASection';
import { Banner } from '@/components/BannerHealth';
import FeaturesPage from '@/pages/FeaturesPage';
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
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
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
      
      {/* Health Benefits Banner */}
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
      
      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default Home;
