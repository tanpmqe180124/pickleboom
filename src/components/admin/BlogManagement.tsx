import React, { useState, useEffect } from 'react';
import { adminService, AdminBlog, AdminBlogRequest } from '@/services/adminService';
import { showToast } from '@/utils/toastManager';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Search,
  Filter,
  Eye,
  EyeOff,
  Save,
  X,
  Calendar,
  User
} from 'lucide-react';

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<AdminBlog | null>(null);
  const [formData, setFormData] = useState<AdminBlogRequest>({
    Title: '',
    Content: '',
    UserID: '',
    BlogStatus: 0
  });

  // ========== FETCH BLOGS ==========
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call when available
      const mockBlogs: AdminBlog[] = [
        {
          ID: '1',
          Title: 'Hướng dẫn chơi Pickleball cho người mới bắt đầu',
          Content: 'Pickleball là môn thể thao kết hợp giữa tennis, bóng bàn và cầu lông...',
          UserID: 'user1',
          ThumbnailUrl: '/img/blog1.png',
          BlogStatus: 1,
          CreatedAt: '2024-01-15T10:30:00Z'
        },
        {
          ID: '2',
          Title: 'Lợi ích sức khỏe của việc chơi Pickleball',
          Content: 'Chơi Pickleball mang lại nhiều lợi ích cho sức khỏe...',
          UserID: 'user1',
          ThumbnailUrl: '/img/blog2.jpg',
          BlogStatus: 0,
          CreatedAt: '2024-01-14T14:20:00Z'
        },
        {
          ID: '3',
          Title: 'Kỹ thuật giao bóng trong Pickleball',
          Content: 'Giao bóng là kỹ thuật cơ bản và quan trọng nhất...',
          UserID: 'user2',
          ThumbnailUrl: '/img/blog3.jpg',
          BlogStatus: 2,
          CreatedAt: '2024-01-13T09:15:00Z'
        }
      ];
      setBlogs(mockBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách blog.');
    } finally {
      setLoading(false);
    }
  };

  // ========== HANDLE FORM SUBMIT ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await adminService.updateBlog(editingBlog.ID, formData);
        showToast.success('Cập nhật thành công', 'Bài viết đã được cập nhật.');
      } else {
        await adminService.createBlog(formData);
        showToast.success('Tạo thành công', 'Bài viết mới đã được tạo.');
      }
      
      setShowModal(false);
      setEditingBlog(null);
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      showToast.error('Lỗi lưu dữ liệu', 'Không thể lưu thông tin bài viết.');
    }
  };

  // ========== HANDLE EDIT ==========
  const handleEdit = (blog: AdminBlog) => {
    setEditingBlog(blog);
    setFormData({
      Title: blog.Title,
      Content: blog.Content,
      UserID: blog.UserID,
      BlogStatus: blog.BlogStatus
    });
    setShowModal(true);
  };

  // ========== HANDLE DELETE ==========
  const handleDelete = async (blogId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await adminService.deleteBlog(blogId);
        showToast.success('Xóa thành công', 'Bài viết đã được xóa.');
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        showToast.error('Lỗi xóa dữ liệu', 'Không thể xóa bài viết.');
      }
    }
  };

  // ========== RESET FORM ==========
  const resetForm = () => {
    setFormData({
      Title: '',
      Content: '',
      UserID: '',
      BlogStatus: 0
    });
  };

  // ========== HANDLE MODAL CLOSE ==========
  const handleModalClose = () => {
    setShowModal(false);
    setEditingBlog(null);
    resetForm();
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
  }, []);

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
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">Thêm bài viết mới</span>
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
            <div key={blog.ID} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              {/* Blog Thumbnail */}
              <div className="h-48 bg-gray-200 relative">
                {blog.ThumbnailUrl ? (
                  <img
                    src={blog.ThumbnailUrl}
                    alt={blog.Title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  {renderStatusBadge(blog.BlogStatus)}
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {blog.Title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {blog.Content}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    ID: {blog.UserID}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(blog.CreatedAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.ID)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========== MODAL ========== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingBlog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
              </h3>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  required
                  value={formData.Title}
                  onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nhập tiêu đề bài viết..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung *
                </label>
                <textarea
                  required
                  value={formData.Content}
                  onChange={(e) => setFormData({ ...formData, Content: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nhập nội dung bài viết..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Tác giả *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.UserID}
                    onChange={(e) => setFormData({ ...formData, UserID: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Nhập ID tác giả..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái *
                  </label>
                  <select
                    value={formData.BlogStatus}
                    onChange={(e) => setFormData({ ...formData, BlogStatus: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value={0}>Bản nháp</option>
                    <option value={1}>Đã xuất bản</option>
                    <option value={2}>Đã ẩn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, ThumbnailUrl: file });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingBlog ? 'Cập nhật' : 'Tạo mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;

