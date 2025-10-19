import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Users, Building2 } from 'lucide-react';

const HeroSection = () => {
  const handleFindCourt = () => {
    window.location.href = '/playertype';
  };

  const handleRegisterCourt = () => {
    window.location.href = '/playertype';
  };

  return (
    <div className="w-full">
      {/* Hero Section - Web trung gian */}
      <div className="relative min-h-screen bg-gradient-to-br from-[#2F3C54] via-[#1E2A3A] to-[#0F1419] overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#EAB308] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#FCBA6B] rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#EAB308] rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          {/* Additional floating elements */}
          <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-white/5 rounded-full blur-2xl animate-bounce" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-[#FCBA6B]/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* Animated geometric shapes */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-4 h-4 bg-[#EAB308] rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-32 left-16 w-6 h-6 bg-[#FCBA6B] rotate-12 animate-spin" style={{animationDuration: '12s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white rotate-45 animate-spin" style={{animationDuration: '6s'}}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center">
            {/* Main Heading - Mobile Optimized */}
            <motion.div 
              className="mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-2 sm:mb-4 leading-none tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Nền tảng
              </motion.h1>
              <motion.div 
                className="text-3xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] via-[#FCBA6B] to-[#EAB308] mb-4 sm:mb-6 leading-none tracking-tight"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Pickleball
              </motion.div>
              <motion.h2 
                className="text-xl sm:text-3xl md:text-5xl font-bold text-white leading-tight tracking-wide px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Kết nối sân và người chơi
              </motion.h2>
            </motion.div>

            {/* Subtitle - Mobile Optimized */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-wide px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Nền tảng trung gian hàng đầu tại Quy Nhơn giúp kết nối các sân pickleball 
              với cộng đồng người chơi. Đặt sân dễ dàng, quản lý hiệu quả.
            </motion.p>

            {/* Enhanced CTA Buttons - Mobile Optimized */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#EAB308] to-[#FCBA6B] rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Button 
                  size="lg" 
                  className="relative bg-[#EAB308] hover:bg-[#D4A017] text-[#2F3C54] font-bold px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg rounded-full shadow-2xl hover:shadow-[#EAB308]/30 transition-all duration-300 border-0 w-full sm:w-auto"
                  onClick={handleFindCourt}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    Tìm sân ngay
                  </span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/10 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Button 
                  size="lg"
                  className="relative bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#2F3C54] font-bold px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 w-full sm:w-auto"
                  onClick={handleRegisterCourt}
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    Đăng ký sân
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats - Mobile Optimized */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 max-w-5xl mx-auto px-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="text-4xl sm:text-6xl md:text-7xl font-black text-[#EAB308] mb-2 sm:mb-4 tracking-tight"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.6, type: "spring", stiffness: 200 }}
                >
                  10+
                </motion.div>
                <div className="text-gray-200 text-base sm:text-xl font-medium tracking-wide">Sân đối tác</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="text-4xl sm:text-6xl md:text-7xl font-black text-[#EAB308] mb-2 sm:mb-4 tracking-tight"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.8, type: "spring", stiffness: 200 }}
                >
                  100+
                </motion.div>
                <div className="text-gray-200 text-base sm:text-xl font-medium tracking-wide">Người chơi</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="text-4xl sm:text-6xl md:text-7xl font-black text-[#EAB308] mb-2 sm:mb-4 tracking-tight"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 2.0, type: "spring", stiffness: 200 }}
                >
                  1000+
                </motion.div>
                <div className="text-gray-200 text-base sm:text-xl font-medium tracking-wide">Lượt đặt sân</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
