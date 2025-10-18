import React, { useState, useEffect } from 'react';
import { blogService, PublicBlog } from '@/services/blogService';
import { adminService } from '@/services/adminService';
import { showToast } from '@/utils/toastManager';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { 
  FileText, 
  Trash2, 
  RefreshCw,
  Search,
  Filter,
  Eye,
  EyeOff,
  Calendar,
  User
} from 'lucide-react';

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<PublicBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [blogToDelete, setBlogToDelete] = useState<PublicBlog | null>(null);

  // ========== FETCH BLOGS ==========
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const blogsData = await blogService.getBlogs({
        Page: 1,
        PageSize: 50, // Lấy nhiều blog để admin có thể xem
        Status: statusFilter || undefined
      });
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách blog.');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== HANDLE DELETE ==========
  const handleDeleteClick = (blog: PublicBlog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    
    try {
      await adminService.deleteBlog(blogToDelete.id);
      showToast.success('Xóa thành công', 'Bài viết đã được xóa.');
      setShowDeleteModal(false);
      setBlogToDelete(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      showToast.error('Lỗi xóa dữ liệu', 'Không thể xóa bài viết.');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  // ========== RENDER STATUS BADGE ==========
  const renderStatusBadge = (status: number) => {
    const statusConfig = {
      0: { text: 'Bản nháp', class: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200', icon: FileText },
      1: { text: 'Đã xuất bản', class: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200', icon: Eye },
      2: { text: 'Đã ẩn', class: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200', icon: EyeOff }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig[0];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${config.class}`}>
        <Icon className="h-3 w-3 mr-1.5" />
        {config.text}
      </span>
    );
  };

  // ========== FORMAT DATE ==========
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchBlogs();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-2">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý blog</h2>
            <p className="text-sm text-gray-500">Quản lý nội dung và bài viết</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchBlogs}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all duration-200 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="font-medium">Làm mới</span>
          </button>
        </div>
      </div>

      {/* ========== SEARCH AND FILTER ========== */}
      <div className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white shadow-sm transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter === null ? '' : statusFilter}
              onChange={(e) => setStatusFilter(e.target.value === '' ? null : parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white shadow-sm transition-all duration-200"
            >
              <option value="">Tất cả trạng thái</option>
              <option value={0}>Bản nháp</option>
              <option value={1}>Đã xuất bản</option>
              <option value={2}>Đã ẩn</option>
            </select>
          </div>

          {/* Search Button */}
          <button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md">
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* ========== BLOGS GRID ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-16">
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-white animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Không có bài viết nào</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              {/* Blog Thumbnail */}
              <div className="h-48 bg-gray-200 relative">
                {blog.thumbnailUrl ? (
                  <img
                    src={blog.thumbnailUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  {renderStatusBadge(blog.status)}
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    ID: {blog.id}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(blog.createdAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => handleDeleteClick(blog)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa bài viết"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========== CONFIRMATION MODAL ========== */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Xóa bài viết"
        message={`Bạn có chắc chắn muốn xóa bài viết "${blogToDelete?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
};

export default BlogManagement;

