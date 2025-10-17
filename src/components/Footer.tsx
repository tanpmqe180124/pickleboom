import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2F3C54] text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <img
              src="/img/brandlogo_white_clean.png"
              className="h-16 w-auto mb-4"
              alt="Pickle Boom Logo"
            />
            <p className="text-gray-300 mb-4 max-w-md">
              Nền tảng đặt sân pickleball hàng đầu Việt Nam. Kết nối người chơi với các sân chất lượng cao.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/playertype" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Đặt sân
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-orange-500" />
                <span className="text-gray-300">0389145575</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-orange-500" />
                <span className="text-gray-300">info@pickleboom.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-orange-500" />
                <span className="text-gray-300">TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 PickleBoom. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
