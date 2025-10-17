import React, { useState, useEffect } from 'react';
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

// ========== INTERFACES ==========
export interface BaseBlog {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  thumbnailUrl?: string; // Add thumbnailUrl field from API
  createdAt: string;
  updatedAt: string;
  userId?: string;
  authorName?: string;
  isPublished?: boolean;
}

export interface BaseBlogRequest {
  Title: string;
  Content: string;
  UserID?: string;
  Image?: File;
}

interface BaseBlogManagementProps {
  userRole: 'Admin' | 'Partner';
  apiService: {
    getBlogs: (params?: any) => Promise<BaseBlog[]>;
    getBlogById: (id: string) => Promise<BaseBlog>;
    createBlog: (data: BaseBlogRequest) => Promise<string>;
    updateBlog: (id: string, data: BaseBlogRequest) => Promise<string>;
    deleteBlog: (id: string) => Promise<string>;
  };
  permissions: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canViewAll: boolean;
  };
}

const BaseBlogManagement: React.FC<BaseBlogManagementProps> = ({
  userRole,
  apiService,
  permissions
}) => {
  const [blogs, setBlogs] = useState<BaseBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<BaseBlog | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [blogToDelete, setBlogToDelete] = useState<BaseBlog | null>(null);
  const [formData, setFormData] = useState<BaseBlogRequest>({
    Title: '',
    Content: '',
    UserID: ''
  });

  // ========== FETCH BLOGS ==========
  const fetchBlogs = async (searchParams?: { Title?: string; UserID?: string }) => {
    setLoading(true);
    try {
      const blogsData = await apiService.getBlogs(searchParams);
      console.log('Blogs API Response:', blogsData);
      
      if (Array.isArray(blogsData)) {
        setBlogs(blogsData);
      } else {
        console.warn('API returned non-array data:', blogsData);
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách blog.');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchBlogs();
  }, []);

  // ========== HANDLERS ==========
  const handleCreate = () => {
    setEditingBlog(null);
    setFormData({
      Title: '',
      Content: '',
      UserID: ''
    });
    setShowModal(true);
  };

  const handleEdit = (blog: BaseBlog) => {
    setEditingBlog(blog);
    setFormData({
      Title: blog.title,
      Content: blog.content,
      UserID: blog.userId || ''
    });
    setShowModal(true);
  };

  const handleDelete = (blog: BaseBlog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingBlog) {
        await apiService.updateBlog(editingBlog.id, formData);
        showToast.success('Cập nhật thành công', 'Blog đã được cập nhật.');
      } else {
        await apiService.createBlog(formData);
        showToast.success('Tạo thành công', 'Blog mới đã được tạo.');
      }
      
      setShowModal(false);
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      showToast.error('Lỗi lưu dữ liệu', 'Không thể lưu blog.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    
    setLoading(true);
    try {
      await apiService.deleteBlog(blogToDelete.id);
      showToast.success('Xóa thành công', 'Blog đã được xóa.');
      setShowDeleteModal(false);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      showToast.error('Lỗi xóa dữ liệu', 'Không thể xóa blog.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchBlogs({
      Title: searchTerm || undefined,
      UserID: statusFilter ? String(statusFilter) : undefined
    });
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter(null);
    fetchBlogs();
  };

  // ========== FILTERED BLOGS ==========
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === null || (blog.userId && String(blog.userId) === String(statusFilter));
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Quản lý Blog {userRole === 'Partner' ? 'Pickleball' : ''}
        </h2>
        {permissions.canCreate && (
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Thêm blog mới</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tiêu đề hoặc nội dung..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tác giả
            </label>
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              {/* Add author options here if needed */}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSearch}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Search size={20} />
              <span>Tìm kiếm</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RefreshCw size={20} />
              <span>Làm mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Blogs List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có blog nào</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== null 
                ? 'Không tìm thấy blog phù hợp với bộ lọc.' 
                : 'Chưa có blog nào được tạo.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  {/* Blog Thumbnail */}
                  <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                    {(blog.imageUrl || blog.thumbnailUrl) ? (
                      <img
                        src={blog.imageUrl || blog.thumbnailUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${(blog.imageUrl || blog.thumbnailUrl) ? 'hidden' : ''}`}>
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {blog.title}
                      </h3>
                      {blog.isPublished !== undefined && (
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          blog.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <User size={16} />
                        <span>{blog.authorName || 'Không xác định'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 line-clamp-3">
                      {blog.content}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(blog)}
                      disabled={!permissions.canEdit}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog)}
                      disabled={!permissions.canDelete}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingBlog ? 'Chỉnh sửa blog' : 'Thêm blog mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  value={formData.Title}
                  onChange={(e) => setFormData({...formData, Title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung *
                </label>
                <textarea
                  value={formData.Content}
                  onChange={(e) => setFormData({...formData, Content: e.target.value})}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình ảnh
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({...formData, Image: file});
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={16} />
                  <span>{loading ? 'Đang lưu...' : editingBlog ? 'Cập nhật' : 'Tạo mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && blogToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa blog "{blogToDelete.title}"?
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseBlogManagement;

