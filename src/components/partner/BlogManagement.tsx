import React, { useState } from 'react';
import { partnerService, PartnerBlogRequest } from '@/services/partnerService';
import { showToast } from '@/utils/toastManager';
import { 
  FileText, 
  Plus, 
  Edit, 
  Save,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const BlogManagement: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [formData, setFormData] = useState<Omit<PartnerBlogRequest, 'ParnerID'>>({
    Title: '',
    Content: '',
    ThumbnailUrl: null as any,
    BlogStatus: 0 // Draft
  });

  // ========== HANDLERS ==========
  const handleOpenModal = (blog?: any) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        Title: blog.Title || '',
        Content: blog.Content || '',
        ThumbnailUrl: null as any,
        BlogStatus: blog.Status || 0
      });
    } else {
      setEditingBlog(null);
      setFormData({
        Title: '',
        Content: '',
        ThumbnailUrl: null as any,
        BlogStatus: 0
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setFormData({
      Title: '',
      Content: '',
      ThumbnailUrl: null as any,
      BlogStatus: 0
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'BlogStatus' ? parseInt(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        showToast.error('Lỗi', 'Chỉ chấp nhận file .jpg, .jpeg, .png');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast.error('Lỗi', 'Kích thước file không được vượt quá 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        ThumbnailUrl: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.Title || formData.Title.length < 10 || formData.Title.length > 150) {
      showToast.error('Lỗi', 'Tiêu đề phải có độ dài từ 10 đến 150 ký tự');
      return;
    }

    if (!formData.Content || formData.Content.length < 50) {
      showToast.error('Lỗi', 'Nội dung phải có ít nhất 50 ký tự');
      return;
    }

    if (!formData.ThumbnailUrl) {
      showToast.error('Lỗi', 'Vui lòng chọn ảnh thumbnail');
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingBlog) {
        await partnerService.updateBlog(editingBlog.ID, formData);
        showToast.success('Thành công', 'Cập nhật blog thành công');
      } else {
        await partnerService.createBlog(formData);
        showToast.success('Thành công', 'Tạo blog thành công');
      }

      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving blog:', error);
      showToast.error('Lỗi', 'Không thể lưu blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== RENDER ==========
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Blog</h2>
          <p className="text-gray-600">Tạo và cập nhật bài viết blog</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Tạo blog mới</span>
        </button>
      </div>

      {/* Empty State */}
      <div className="text-center py-12">
        <FileText size={64} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có blog nào</h3>
        <p className="text-gray-600 mb-6">Hãy tạo blog đầu tiên để bắt đầu</p>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
        >
          <Plus size={20} />
          <span>Tạo blog mới</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingBlog ? 'Cập nhật blog' : 'Tạo blog mới'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    name="Title"
                    value={formData.Title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tiêu đề blog (10-150 ký tự)"
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.Title.length}/150 ký tự
                  </p>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung *
                  </label>
                  <textarea
                    name="Content"
                    value={formData.Content}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập nội dung blog (tối thiểu 50 ký tự)"
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.Content.length} ký tự (tối thiểu 50)
                  </p>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ảnh thumbnail *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="thumbnail-upload"
                      required
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload size={32} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formData.ThumbnailUrl ? formData.ThumbnailUrl.name : 'Chọn ảnh thumbnail'}
                      </span>
                      <span className="text-xs text-gray-500">
                        JPG, PNG (tối đa 5MB)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Blog Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="BlogStatus"
                    value={formData.BlogStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value={0}>Bản nháp</option>
                    <option value={1}>Đã xuất bản</option>
                    <option value={2}>Ẩn</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    disabled={isSubmitting}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    <span>{editingBlog ? 'Cập nhật' : 'Tạo mới'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
