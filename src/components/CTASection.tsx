import React from 'react';
import { Button } from '@/components/ui/button';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { Users, Building2, Calendar, DollarSign } from 'lucide-react';

export const CTASection = () => {
  const [ref, inView] = useInViewAnimation({ threshold: 0.1 }) as [React.RefObject<HTMLDivElement>, boolean];

  return (
    <div className="py-20 bg-gradient-to-r from-[#2F3C54] to-[#1E2A3A]">
      <div className="container mx-auto px-6">
        <div 
          ref={ref}
          className={`text-center transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Tham gia cộng đồng Pickleball
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Dù bạn là chủ sân hay người chơi, chúng tôi có giải pháp phù hợp cho bạn
          </p>

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
    </div>
  );
};
