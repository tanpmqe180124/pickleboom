import React, { useState, useEffect } from 'react';
import { showToast } from '@/utils/toastManager';
import { 
  MapPin, 
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
  DollarSign,
  Clock,
  Image as ImageIcon
} from 'lucide-react';

// ========== INTERFACES ==========
export interface BaseCourt {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerHour: number;
  imageUrl?: string;
  courtStatus: number; // 0: Available, 1: UnderMaintenance, 2: Inactive, 3: Full
  timeSlotIDs?: string[];
  createdAt?: string;
  updatedAt?: string;
  partnerId?: string;
  partnerName?: string;
}

export interface BaseCourtRequest {
  Name: string;
  Description: string;
  Location: string;
  PricePerHour: number;
  ImageUrl?: File;
  CourtStatus: number;
  PartnerId?: string;
}

interface BaseCourtManagementProps {
  userRole: 'Admin' | 'Partner';
  apiService: {
    getCourts: (params?: any) => Promise<BaseCourt[]>;
    getCourtById: (id: string) => Promise<BaseCourt>;
    createCourt: (data: BaseCourtRequest) => Promise<string>;
    updateCourt: (id: string, data: BaseCourtRequest) => Promise<string>;
    deleteCourt: (id: string) => Promise<string>;
    getTimeSlots: (courtId?: string) => Promise<any[]>;
  };
  permissions: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canViewAll: boolean;
  };
}

const BaseCourtManagement: React.FC<BaseCourtManagementProps> = ({
  userRole,
  apiService,
  permissions
}) => {
  const [courts, setCourts] = useState<BaseCourt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCourt, setEditingCourt] = useState<BaseCourt | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [courtToDelete, setCourtToDelete] = useState<BaseCourt | null>(null);
  const [formData, setFormData] = useState<BaseCourtRequest>({
    Name: '',
    Description: '',
    Location: '',
    PricePerHour: 0,
    CourtStatus: 0
  });

  // ========== FETCH COURTS ==========
  const fetchCourts = async (searchParams?: { Name?: string; CourtStatus?: number }) => {
    setLoading(true);
    try {
      const courtsData = await apiService.getCourts(searchParams);
      console.log('Courts API Response:', courtsData);
      
      if (Array.isArray(courtsData)) {
        setCourts(courtsData);
      } else {
        console.warn('API returned non-array data:', courtsData);
        setCourts([]);
      }
    } catch (error) {
      console.error('Error fetching courts:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách sân.');
      setCourts([]);
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
      Description: '',
      Location: '',
      PricePerHour: 0,
      CourtStatus: 0
    });
    setShowModal(true);
  };

  const handleEdit = (court: BaseCourt) => {
    setEditingCourt(court);
    setFormData({
      Name: court.name,
      Description: court.description,
      Location: court.location,
      PricePerHour: court.pricePerHour,
      CourtStatus: court.courtStatus
    });
    setShowModal(true);
  };

  const handleDelete = (court: BaseCourt) => {
    setCourtToDelete(court);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleSearch = () => {
    fetchCourts({
      Name: searchTerm || undefined,
      CourtStatus: statusFilter !== null ? statusFilter : undefined
    });
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter(null);
    fetchCourts();
  };

  // ========== UTILITY FUNCTIONS ==========
  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Có sẵn';
      case 1: return 'Bảo trì';
      case 2: return 'Không hoạt động';
      case 3: return 'Đầy';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-green-100 text-green-800';
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-red-100 text-red-800';
      case 3: return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Không xác định';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ========== FILTERED COURTS ==========
  const filteredCourts = courts.filter(court => {
    const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         court.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         court.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === null || court.courtStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Quản lý Sân {userRole === 'Partner' ? 'Pickleball' : ''}
        </h2>
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
                placeholder="Tìm theo tên, địa điểm hoặc mô tả..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="0">Có sẵn</option>
              <option value="1">Bảo trì</option>
              <option value="2">Không hoạt động</option>
              <option value="3">Đầy</option>
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

      {/* Courts List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCourts.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có sân nào</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== null 
                ? 'Không tìm thấy sân phù hợp với bộ lọc.' 
                : 'Chưa có sân nào được tạo.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCourts.map((court) => (
              <div key={court.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {/* Court Image */}
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  {court.imageUrl ? (
                    <img 
                      src={court.imageUrl} 
                      alt={court.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Court Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {court.name}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(court.courtStatus)}`}>
                      {getStatusText(court.courtStatus)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span className="line-clamp-1">{court.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DollarSign size={16} />
                      <span className="font-medium">{formatPrice(court.pricePerHour)}/giờ</span>
                    </div>
                    
                    {court.timeSlotIDs && court.timeSlotIDs.length > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>{court.timeSlotIDs.length} khung giờ</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                    {court.description}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(court)}
                      disabled={!permissions.canEdit}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
                    >
                      <Edit size={16} />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => handleDelete(court)}
                      disabled={!permissions.canDelete}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                      <span>Xóa</span>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingCourt ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sân *
                  </label>
                  <input
                    type="text"
                    value={formData.Name}
                    onChange={(e) => setFormData({...formData, Name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá mỗi giờ (VND) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.PricePerHour}
                    onChange={(e) => setFormData({...formData, PricePerHour: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa điểm *
                </label>
                <input
                  type="text"
                  value={formData.Location}
                  onChange={(e) => setFormData({...formData, Location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả *
                </label>
                <textarea
                  value={formData.Description}
                  onChange={(e) => setFormData({...formData, Description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={formData.CourtStatus}
                  onChange={(e) => setFormData({...formData, CourtStatus: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="0">Có sẵn</option>
                  <option value="1">Bảo trì</option>
                  <option value="2">Không hoạt động</option>
                  <option value="3">Đầy</option>
                </select>
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
                      setFormData({...formData, ImageUrl: file});
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
                  <span>{loading ? 'Đang lưu...' : editingCourt ? 'Cập nhật' : 'Tạo mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courtToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa sân "{courtToDelete.name}"?
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

export default BaseCourtManagement;
