import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { blogService, PublicBlog } from '@/services/blogService';
import { Calendar, User, ArrowLeft, Share2, Clock, Eye, Heart, BookOpen } from 'lucide-react';
import dayjs from 'dayjs';
import { showToast } from '@/utils/toastManager';

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<PublicBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<PublicBlog[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setError('Không tìm thấy ID blog.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fetchedBlog = await blogService.getBlogById(id);
        setBlog(fetchedBlog);

        // Fetch related blogs
        const allBlogs = await blogService.getBlogs({ Status: 1 });
        const related = allBlogs.filter(b => b.id !== id).slice(0, 3);
        setRelatedBlogs(related);

      } catch (err) {
        console.error('Error fetching blog detail:', err);
        showToast.error('Lỗi tải dữ liệu', 'Không thể tải chi tiết blog.');
        setError('Không thể tải chi tiết blog. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.content.replace(/<[^>]*>/g, '').substring(0, 200),
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showToast.success('Đã sao chép link', 'Link bài viết đã được sao chép vào clipboard.');
    }
  };

  const calculateReadingTime = (content: string) => {
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / 200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <div className="text-8xl mb-6">😞</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Oops! Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => navigate('/blog')}
              className="bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium"
            >
              Quay lại trang blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <div className="text-8xl mb-6">📝</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy blog</h3>
            <p className="text-gray-600 mb-8">Blog này có thể đã bị xóa hoặc không tồn tại.</p>
            <button
              onClick={() => navigate('/blog')}
              className="bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium"
            >
              Quay lại trang blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(blog.content);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-6 py-6">
        <motion.button
          onClick={() => navigate('/blog')}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors font-medium"
          whileHover={{ x: -4 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowLeft size={20} />
          <span>Quay lại trang blog</span>
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex items-center justify-center space-x-6 text-gray-600 mb-8">
              <div className="flex items-center space-x-2">
                <User size={20} className="text-orange-500" />
                <span className="font-medium">{blog.partnerName || 'PickleBoom Team'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-orange-500" />
                <span>{dayjs(blog.createdAt).format('DD/MM/YYYY')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={20} className="text-orange-500" />
                <span>{readingTime} phút đọc</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium"
              >
                <Share2 size={18} />
                <span>Chia sẻ</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                <Heart size={18} />
                <span>Thích</span>
              </button>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {blog.thumbnailUrl ? (
                <img
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  className="w-full h-96 md:h-[500px] object-cover"
                />
              ) : (
                <div className="w-full h-96 md:h-[500px] bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🏓</div>
                    <p className="text-2xl font-bold text-orange-600">Pickleball Blog</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          </motion.div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <BookOpen size={24} className="text-orange-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Bài viết liên quan</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((relatedBlog, index) => (
                    <motion.div
                      key={relatedBlog.id}
                      className="bg-gray-50 rounded-xl p-6 hover:bg-orange-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/blog/${relatedBlog.id}`)}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {relatedBlog.thumbnailUrl && (
                        <img
                          src={relatedBlog.thumbnailUrl}
                          alt={relatedBlog.title}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedBlog.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;