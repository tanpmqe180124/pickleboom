import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    id: 1,
    question: 'Làm thế nào để đặt sân pickleball?',
    answer: 'Bạn chỉ cần truy cập trang web, chọn sân yêu thích, chọn thời gian và thanh toán. Quá trình đặt sân chỉ mất vài phút!'
  },
  {
    id: 2,
    question: 'Có thể hủy đặt sân không?',
    answer: 'Có, bạn có thể hủy đặt sân trước 2 giờ. Phí hủy sẽ được hoàn lại 100% nếu hủy trước 24 giờ.'
  },
  {
    id: 3,
    question: 'Thanh toán có an toàn không?',
    answer: 'Chúng tôi sử dụng hệ thống thanh toán PayOS và các phương thức bảo mật khác. Thông tin thẻ của bạn được mã hóa và bảo vệ tuyệt đối.'
  },
  {
    id: 4,
    question: 'Có hỗ trợ người mới chơi không?',
    answer: 'Có! Chúng tôi có đội ngũ hướng dẫn chuyên nghiệp và cộng đồng người chơi thân thiện sẵn sàng giúp đỡ người mới.'
  },
  {
    id: 5,
    question: 'Làm sao để trở thành đối tác sân?',
    answer: 'Bạn có thể đăng ký làm đối tác qua trang web hoặc gọi hotline. Chúng tôi sẽ hỗ trợ setup và hướng dẫn sử dụng hệ thống quản lý.'
  }
];

const FAQItem = ({ faq, isOpen, onToggle }: { faq: any, isOpen: boolean, onToggle: () => void }) => {
  return (
    <motion.div 
      className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <button
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold text-gray-800 pr-4">{faq.question}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[#FCBA6B] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-4 text-gray-600 leading-relaxed">
          {faq.answer}
        </div>
      </motion.div>
    </motion.div>
  );
};

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <motion.div 
      className="py-24 bg-gradient-to-br from-white to-gray-50"
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
            Câu hỏi thường gặp
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
            Tìm hiểu thêm về dịch vụ và cách sử dụng PickleBoom
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openFAQ === faq.id}
              onToggle={() => toggleFAQ(faq.id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#2F3C54] text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo và mô tả */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img
                src="/img/brandlogo_white_clean.png"
                className="h-16 w-auto object-contain"
                alt="PickleBoom Logo"
              />
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Nền tảng trung gian hàng đầu tại Quy Nhơn giúp kết nối các sân pickleball với cộng đồng người chơi. 
              Đặt sân dễ dàng, quản lý hiệu quả.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-[#FCBA6B] rounded-full flex items-center justify-center hover:bg-[#EAB308] transition-colors duration-300 cursor-pointer">
                <Phone className="w-5 h-5 text-[#2F3C54]" />
              </div>
              <div className="w-10 h-10 bg-[#FCBA6B] rounded-full flex items-center justify-center hover:bg-[#EAB308] transition-colors duration-300 cursor-pointer">
                <Mail className="w-5 h-5 text-[#2F3C54]" />
              </div>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[#FCBA6B]">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li><a href="/playertype" className="text-gray-300 hover:text-white transition-colors duration-200">Đặt sân</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors duration-200">Tin tức</a></li>
              <li><a href="/login" className="text-gray-300 hover:text-white transition-colors duration-200">Đăng nhập</a></li>
              <li><a href="/register" className="text-gray-300 hover:text-white transition-colors duration-200">Đăng ký</a></li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[#FCBA6B]">Liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#FCBA6B]" />
                <span className="text-gray-300">0389145575</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#FCBA6B]" />
                <span className="text-gray-300">support@pickleboom.vn</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-[#FCBA6B]" />
                <span className="text-gray-300">Quy Nhơn, Bình Định</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#FCBA6B]" />
                <span className="text-gray-300">24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-600 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 PickleBoom. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Chính sách bảo mật</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Điều khoản sử dụng</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Liên hệ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { FAQSection, Footer };
