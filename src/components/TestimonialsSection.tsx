import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn Minh',
    role: 'Người chơi pickleball',
    avatar: '/img/avatar1.jpg',
    content: 'PickleBoom đã thay đổi hoàn toàn cách tôi chơi pickleball. Đặt sân dễ dàng, giá cả hợp lý và dịch vụ hỗ trợ tuyệt vời!',
    rating: 5,
    location: 'Quy Nhơn'
  },
  {
    id: 2,
    name: 'Trần Thị Hoa',
    role: 'Chủ sân pickleball',
    avatar: '/img/avatar2.jpg',
    content: 'Nhờ PickleBoom, sân của tôi luôn đầy khách. Hệ thống quản lý thông minh giúp tôi tiết kiệm thời gian và tăng doanh thu.',
    rating: 5,
    location: 'Quy Nhơn'
  },
  {
    id: 3,
    name: 'Lê Minh Tuấn',
    role: 'Người chơi thường xuyên',
    avatar: '/img/avatar3.jpg',
    content: 'Cộng đồng pickleball ở đây rất thân thiện. Tôi đã kết bạn được nhiều người và cải thiện kỹ năng chơi đáng kể.',
    rating: 5,
    location: 'Quy Nhơn'
  },
  {
    id: 4,
    name: 'Phạm Thị Lan',
    role: 'Người mới bắt đầu',
    avatar: '/img/avatar4.jpg',
    content: 'Là người mới chơi, tôi rất lo lắng về việc tìm sân phù hợp. PickleBoom đã giúp tôi tìm được sân tốt và người chơi cùng.',
    rating: 5,
    location: 'Quy Nhơn'
  }
];

const TestimonialsSection = () => {
  return (
    <motion.div 
      className="py-24 bg-gradient-to-br from-gray-50 to-white"
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
            Khách hàng nói gì về chúng tôi?
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
            Hơn 1000+ người chơi đã tin tưởng và hài lòng với dịch vụ của PickleBoom
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Quote icon */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#FCBA6B] rounded-full flex items-center justify-center">
                <Quote className="w-4 h-4 text-white" />
              </div>

              {/* Rating stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FCBA6B] text-[#FCBA6B]" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              {/* User info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FCBA6B] to-[#EAB308] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-xs text-[#FCBA6B] font-medium">{testimonial.location}</p>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FCBA6B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div 
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-[#FCBA6B] mb-2">98%</div>
            <div className="text-gray-600 font-medium">Khách hàng hài lòng</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-[#FCBA6B] mb-2">4.9/5</div>
            <div className="text-gray-600 font-medium">Đánh giá trung bình</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-[#FCBA6B] mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Hỗ trợ khách hàng</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TestimonialsSection;
