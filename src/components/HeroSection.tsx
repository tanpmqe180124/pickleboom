import React from 'react';
import { Button } from '@/components/ui/button';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';

export const HeroSection = () => {
  const [ref, inView] = useInViewAnimation({ threshold: 0.1 }) as [React.RefObject<HTMLDivElement>, boolean];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#2F3C54] via-[#1E2A3A] to-[#0F1419] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#EAB308] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#FCBA6B] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#EAB308] rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div 
          ref={ref}
          className={`text-center transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
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

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-4 h-4 bg-[#EAB308] rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-6 h-6 bg-[#FCBA6B] rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-white rounded-full animate-pulse delay-500"></div>
    </div>
  );
};
