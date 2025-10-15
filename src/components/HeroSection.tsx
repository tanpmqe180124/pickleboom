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
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#EAB308] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#FCBA6B] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#EAB308] rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center">
            {/* Main Heading */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-black text-white mb-4 leading-none tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Nền tảng
              </motion.h1>
              <motion.div 
                className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] via-[#FCBA6B] to-[#EAB308] mb-6 leading-none tracking-tight"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Pickleball
              </motion.div>
              <motion.h2 
                className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Kết nối sân và người chơi
              </motion.h2>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
              className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Nền tảng trung gian hàng đầu tại Quy Nhơn giúp kết nối các sân pickleball 
              với cộng đồng người chơi. Đặt sân dễ dàng, quản lý hiệu quả.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-[#EAB308] hover:bg-[#D4A017] text-[#2F3C54] font-bold px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-[#EAB308]/25 transition-all duration-300"
                  onClick={handleFindCourt}
                >
                  Tìm sân ngay
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#2F3C54] font-bold px-8 py-4 text-lg rounded-full shadow-2xl transition-all duration-300"
                  style={{ 
                    color: 'white',
                    backgroundColor: 'transparent',
                    borderColor: 'white'
                  }}
                  onClick={handleRegisterCourt}
                >
                  Đăng ký sân
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto"
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
                  className="text-6xl md:text-7xl font-black text-[#EAB308] mb-4 tracking-tight"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.6, type: "spring", stiffness: 200 }}
                >
                  50+
                </motion.div>
                <div className="text-gray-200 text-xl font-medium tracking-wide">Sân đối tác</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="text-6xl md:text-7xl font-black text-[#EAB308] mb-4 tracking-tight"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.8, type: "spring", stiffness: 200 }}
                >
                  1000+
                </motion.div>
                <div className="text-gray-200 text-xl font-medium tracking-wide">Người chơi</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="text-6xl md:text-7xl font-black text-[#EAB308] mb-4 tracking-tight"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 2.0, type: "spring", stiffness: 200 }}
                >
                  5000+
                </motion.div>
                <div className="text-gray-200 text-xl font-medium tracking-wide">Lượt đặt sân</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
