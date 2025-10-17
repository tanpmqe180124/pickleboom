import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogService, PublicBlog } from '@/services/blogService';
import { Calendar, User, ArrowLeft, Share2, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import { showToast } from '@/utils/toastManager';

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<PublicBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<PublicBlog[]>([]);

  // Fetch blog detail
  const fetchBlogDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const blogData = await blogService.getBlogById(id);
      setBlog(blogData);
      
      // Fetch related blogs
      const related = await blogService.getLatestBlogs(3);
      setRelatedBlogs(related.filter(b => b.id !== id));
      
    } catch (error) {
      console.error('Error fetching blog detail:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải bài viết.');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  // Share blog
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.content.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showToast.success('Đã sao chép link', 'Link bài viết đã được sao chép vào clipboard.');
    }
  };

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
          <p className="text-gray-600 mb-8">Bài viết này có thể đã bị xóa hoặc không tồn tại.</p>
          <button
            onClick={() => navigate('/blog')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Quay lại danh sách blog
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-8">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Quay lại danh sách blog</span>
        </button>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Blog Header */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-[#2F3C54] mb-6 leading-tight">
              {blog.title}
            </h1>
            
            {/* Blog Meta */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar size={18} />
                <span>{dayjs(blog.createdAt).format('DD/MM/YYYY')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={18} />
                <span>{calculateReadingTime(blog.content)} phút đọc</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
              >
                <Share2 size={18} />
                <span>Chia sẻ</span>
              </button>
            </div>

            {/* Blog Thumbnail */}
            {blog.thumbnailUrl && (
              <div className="mb-8">
                <img
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
          </motion.div>

          {/* Blog Content */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br>') }}
            />
          </motion.div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <motion.div 
              className="bg-white rounded-lg shadow-sm border p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-[#2F3C54] mb-6">Bài viết liên quan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <div
                    key={relatedBlog.id}
                    onClick={() => navigate(`/blog/${relatedBlog.id}`)}
                    className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg overflow-hidden border"
                  >
                    {relatedBlog.thumbnailUrl && (
                      <img
                        src={relatedBlog.thumbnailUrl}
                        alt={relatedBlog.title}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {dayjs(relatedBlog.createdAt).format('DD/MM/YYYY')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
