import React, { useState, useEffect } from 'react';
import { showToast } from '@/utils/toastManager';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Save,
  X
} from 'lucide-react';

// ========== INTERFACES ==========
export interface BaseCourt {
  id: string;
  name: string;
  address: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

export interface BaseCourtRequest {
  Name: string;
  Address: string;
  Description: string;
  Price: number;
  ImageUrl?: File | string;
}

interface BaseCourtManagementProps {
  userRole: 'Admin' | 'Partner';
  apiService: {
    getCourts: () => Promise<BaseCourt[]>;
    getCourtById: (id: string) => Promise<BaseCourt>;
    createCourt: (data: BaseCourtRequest) => Promise<string>;
    updateCourt: (id: string, data: BaseCourtRequest) => Promise<string>;
    deleteCourt: (id: string) => Promise<string>;
  };
  permissions: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canViewAll: boolean;
  };
}

// ========== COURT CARD COMPONENT ==========
interface CourtCardProps {
  court: BaseCourt;
  onEdit: (court: BaseCourt) => void;
  onDelete: (court: BaseCourt) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const CourtCard: React.FC<CourtCardProps> = ({ court, onEdit, onDelete, canEdit, canDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        {court.imageUrl ? (
          <img 
            src={court.imageUrl} 
            alt={court.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <MapPin size={48} />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            court.isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {court.isAvailable ? 'Có sẵn' : 'Không có sẵn'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{court.name}</h3>
        <p className="text-gray-600 text-sm mb-2 flex items-center">
          <MapPin size={16} className="mr-1" />
          {court.address}
        </p>
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{court.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-green-600">
            {court.price.toLocaleString('vi-VN')} VNĐ/giờ
          </span>
          <div className="flex space-x-2">
            {canEdit && (
              <button
                onClick={() => onEdit(court)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Chỉnh sửa"
              >
                <Edit size={16} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(court)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Xóa"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
const BaseCourtManagement: React.FC<BaseCourtManagementProps> = ({
  userRole,
  apiService,
  permissions
}) => {
  console.log('🏟️ BaseCourtManagement component rendered with userRole:', userRole);
  
  // ========== STATE ==========
  const [courts, setCourts] = useState<BaseCourt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCourt, setEditingCourt] = useState<BaseCourt | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [courtToDelete, setCourtToDelete] = useState<BaseCourt | null>(null);
  const [formData, setFormData] = useState<BaseCourtRequest>({
    Name: '',
    Address: '',
    Description: '',
    Price: 0,
    ImageUrl: ''
  });

  // ========== FETCH COURTS ==========
  const fetchCourts = async () => {
    setLoading(true);
    try {
      console.log('🏟️ Fetching courts...');
      const courtsData = await apiService.getCourts();
      console.log('🏟️ Courts API Response:', courtsData);
      
      if (Array.isArray(courtsData)) {
        setCourts(courtsData);
      } else {
        console.warn('API returned non-array data:', courtsData);
        setCourts([]);
      }
    } catch (error) {
      console.error('Error fetching courts:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách sân.');
    } finally {
      setLoading(false);
    }
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchCourts();
  }, []);

  // ========== HANDLERS ==========
  const handleCreate = () => {
    setEditingCourt(null);
    setFormData({
      Name: '',
      Address: '',
      Description: '',
      Price: 0,
      ImageUrl: ''
    });
    setShowModal(true);
  };

  const handleEdit = (court: BaseCourt) => {
    setEditingCourt(court);
    setFormData({
      Name: court.name,
      Address: court.address,
      Description: court.description,
      Price: court.price,
      ImageUrl: court.imageUrl
    });
    setShowModal(true);
  };

  const handleDelete = (court: BaseCourt) => {
    setCourtToDelete(court);
    setShowDeleteModal(true);
  };

  const handleSave = async () => {
    if (!formData.Name || !formData.Address || !formData.Description || formData.Price <= 0) {
      showToast.error('Lỗi dữ liệu', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    try {
      if (editingCourt) {
        await apiService.updateCourt(editingCourt.id, formData);
        showToast.success('Cập nhật thành công', 'Sân đã được cập nhật.');
      } else {
        await apiService.createCourt(formData);
        showToast.success('Tạo thành công', 'Sân mới đã được tạo.');
      }
      
      setShowModal(false);
      fetchCourts();
    } catch (error) {
      console.error('Error saving court:', error);
      showToast.error('Lỗi lưu dữ liệu', 'Không thể lưu sân.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!courtToDelete) return;

    setLoading(true);
    try {
      await apiService.deleteCourt(courtToDelete.id);
      showToast.success('Xóa thành công', 'Sân đã được xóa.');
      setShowDeleteModal(false);
      fetchCourts();
    } catch (error) {
      console.error('Error deleting court:', error);
      showToast.error('Lỗi xóa dữ liệu', 'Không thể xóa sân.');
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDER ==========
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Sân Pickleball</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin và trạng thái các sân</p>
        </div>
        {permissions.canCreate && (
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Thêm sân mới</span>
          </button>
        )}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={fetchCourts}
          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw size={20} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Courts Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : courts.length === 0 ? (
        <div className="text-center py-12">
          <MapPin size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có sân nào</h3>
          <p className="text-gray-500">Chưa có sân nào được tạo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <CourtCard
              key={court.id}
              court={court}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={permissions.canEdit}
              canDelete={permissions.canDelete}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingCourt ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sân *
                </label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên sân"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  value={formData.Address}
                  onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả *
                </label>
                <textarea
                  value={formData.Description}
                  onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Nhập mô tả sân"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá thuê (VNĐ/giờ) *
                </label>
                <input
                  type="number"
                  value={formData.Price}
                  onChange={(e) => setFormData({ ...formData, Price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập giá thuê"
                  min="0"
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
                      setFormData({ ...formData, ImageUrl: file });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courtToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Xác nhận xóa</h3>
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa sân "{courtToDelete.name}"?
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
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

export default BaseCourtManagement;
