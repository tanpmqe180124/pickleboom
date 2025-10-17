import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import BlogCard from '@/components/BlogCard';
import { blogService, PublicBlog } from '@/services/blogService';
import { Search, Calendar, User, Filter } from 'lucide-react';
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

      // For now, we'll simulate pagination since API doesn't return total count
      setBlogs(response);
      setCurrentPage(page);
      
      // Simulate total pages (you might want to modify API to return this)
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-r from-orange-500 to-orange-600 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            BLOG PICKLEBALL
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Khám phá những bài viết mới nhất về pickleball, kỹ thuật chơi và cộng đồng
          </motion.p>
        </div>
      </motion.div>

      {/* Search Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm blog
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Tìm theo tiêu đề hoặc nội dung..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              <Search size={20} />
              <span>Tìm kiếm</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-gray-600">
            <span className="font-medium">{totalBlogs}</span> bài viết được tìm thấy
          </div>
          <div className="text-gray-500 text-sm">
            Trang {currentPage} / {totalPages}
          </div>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy blog nào</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Không có blog nào phù hợp với từ khóa tìm kiếm.' : 'Chưa có blog nào được xuất bản.'}
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {blogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
