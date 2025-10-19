import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: 1,
    title: 'Kỹ thuật cơ bản cho người mới bắt đầu chơi Pickleball',
    excerpt: 'Hướng dẫn chi tiết về các kỹ thuật cơ bản, cách cầm vợt và các động tác quan trọng nhất cho người mới.',
    image: '/img/pickleball-court.jpg',
    date: '15/01/2024',
    readTime: '5 phút đọc',
    category: 'Kỹ thuật'
  },
  {
    id: 2,
    title: 'Giải đấu Pickleball Quy Nhơn 2024 - Thông tin chi tiết',
    excerpt: 'Cập nhật thông tin mới nhất về giải đấu Pickleball lớn nhất tại Quy Nhơn, lịch thi đấu và cách đăng ký.',
    image: '/img/tournament.jpg',
    date: '12/01/2024',
    readTime: '3 phút đọc',
    category: 'Giải đấu'
  },
  {
    id: 3,
    title: 'Lợi ích sức khỏe của việc chơi Pickleball thường xuyên',
    excerpt: 'Khám phá những lợi ích tuyệt vời mà môn thể thao Pickleball mang lại cho sức khỏe thể chất và tinh thần.',
    image: '/img/health-benefits.jpg',
    date: '10/01/2024',
    readTime: '4 phút đọc',
    category: 'Sức khỏe'
  }
];

const BlogSection = () => {
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
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-black text-[#2F3C54] mb-6 tracking-tight">
            Blog & Tin tức
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
            Cập nhật tin tức mới nhất về pickleball, kỹ thuật chơi và cộng đồng
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <div className="w-full h-full bg-gradient-to-br from-[#FCBA6B] to-[#EAB308] flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium">Hình ảnh bài viết</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-[#FCBA6B] text-[#2F3C54] px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#FCBA6B] transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                
                {/* Meta info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Read more button */}
                <Link 
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-[#FCBA6B] font-semibold hover:text-[#EAB308] transition-colors duration-300 group-hover:gap-3"
                >
                  Đọc thêm
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View all button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 bg-[#FCBA6B] hover:bg-[#EAB308] text-[#2F3C54] font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Xem tất cả bài viết
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlogSection;
