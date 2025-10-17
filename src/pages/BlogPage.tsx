import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import BlogCard from '@/components/BlogCard';
import { blogService, PublicBlog } from '@/services/blogService';
import { Search, Calendar, User, Filter, TrendingUp, Star } from 'lucide-react';
import { showToast } from '@/utils/toastManager';

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<PublicBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const pageSize = 12;

  // Fetch blogs
  const fetchBlogs = async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const response = await blogService.getBlogs({
        Page: page,
        PageSize: pageSize,
        Title: search || undefined,
        Status: 1 // Only published blogs
      });

      setBlogs(response);
      setCurrentPage(page);
      setTotalPages(Math.ceil(response.length / pageSize));
      setTotalBlogs(response.length);
      
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách blog.');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchBlogs(1, searchTerm);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchBlogs(page, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <Header />
      
      {/* Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-6">
              <TrendingUp className="text-white mr-3" size={32} />
              <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight">
                BLOG PICKLEBALL
              </h1>
              <Star className="text-yellow-300 ml-3" size={32} />
            </div>
            <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto font-light leading-relaxed mb-8">
              Khám phá những bài viết mới nhất về pickleball, kỹ thuật chơi và cộng đồng
            </p>
            <div className="flex items-center justify-center space-x-6 text-orange-100">
              <div className="flex items-center space-x-2">
                <Calendar size={20} />
                <span>Cập nhật hàng ngày</span>
              </div>
              <div className="flex items-center space-x-2">
                <User size={20} />
                <span>Chuyên gia chia sẻ</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search Section */}
      <div className="container mx-auto px-6 py-12">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tìm kiếm bài viết</h2>
            <p className="text-gray-600">Khám phá những bài viết hay về pickleball</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Tìm theo tiêu đề hoặc nội dung..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg transition-all duration-300"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Search size={20} />
              <span>Tìm kiếm</span>
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-lg px-6 py-3 shadow-md border border-gray-100">
            <span className="text-gray-600">Tìm thấy </span>
            <span className="font-bold text-orange-600 text-lg">{totalBlogs}</span>
            <span className="text-gray-600"> bài viết</span>
          </div>
          <div className="bg-white rounded-lg px-6 py-3 shadow-md border border-gray-100">
            <span className="text-gray-500 text-sm">
              Trang {currentPage} / {totalPages}
            </span>
          </div>
        </motion.div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-100 max-w-md mx-auto">
              <div className="text-8xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy blog nào</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Không có blog nào phù hợp với từ khóa tìm kiếm.' : 'Chưa có blog nào được xuất bản.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    fetchBlogs(1, '');
                  }}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Xem tất cả blog
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <BlogCard blog={blog} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            className="flex justify-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2">
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      page === currentPage
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
