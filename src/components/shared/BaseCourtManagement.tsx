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
  ChevronLeft,
  ChevronRight,
  X,
  Save
} from 'lucide-react';

// ========== INTERFACES ==========
export interface BaseCourt {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerHour: number;
  courtStatus: number;
  timeSlots?: any[];
  imageUrl?: string;
}

export interface BaseCourtRequest {
  Name: string;
  Description: string;
  Location: string;
  PricePerHour: number;
  CourtStatus: number;
  TimeSlotIDs: string[];
  Image?: File;
}

export interface BaseTimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface BaseCourtManagementProps {
  userRole: 'Admin' | 'Partner';
  apiService: {
    getCourts: (params?: any) => Promise<BaseCourt[]>;
    getCourtById: (id: string) => Promise<BaseCourt>;
    createCourt: (data: BaseCourtRequest) => Promise<string>;
    updateCourt: (id: string, data: BaseCourtRequest) => Promise<string>;
    deleteCourt: (id: string) => Promise<string>;
    getTimeSlots: () => Promise<BaseTimeSlot[]>;
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
  const [timeSlots, setTimeSlots] = useState<BaseTimeSlot[]>([]);
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
    CourtStatus: 0,
    TimeSlotIDs: []
  });

  // ========== FETCH COURTS ==========
  const fetchCourts = async (searchParams?: { Name?: string; CourtStatus?: number }) => {
    setLoading(true);
    try {
      const courtsData = await apiService.getCourts(searchParams);
      console.log('Courts API Response:', courtsData);
      
      // Ensure courtsData is an array
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

  // ========== FETCH TIME SLOTS ==========
  const fetchTimeSlots = async () => {
    try {
      const timeSlotsData = await apiService.getTimeSlots();
      setTimeSlots(timeSlotsData);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchCourts();
    fetchTimeSlots();
  }, []);

  // ========== HANDLERS ==========
  const handleCreate = () => {
    setEditingCourt(null);
    setFormData({
      Name: '',
      Description: '',
      Location: '',
      PricePerHour: 0,
      CourtStatus: 0,
      TimeSlotIDs: []
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
      CourtStatus: court.courtStatus,
      TimeSlotIDs: court.timeSlots?.map(ts => ts.id) || []
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
      CourtStatus: statusFilter || undefined
    });
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter(null);
    fetchCourts();
  };

  // ========== FILTERED COURTS ==========
  const filteredCourts = courts.filter(court => {
    const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         court.location.toLowerCase().includes(searchTerm.toLowerCase());
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
                placeholder="Tìm theo tên sân hoặc địa chỉ..."
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
              <option value="0">Không hoạt động</option>
              <option value="1">Hoạt động</option>
              <option value="2">Bảo trì</option>
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa chỉ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá/giờ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khung giờ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourts.map((court) => (
                  <tr key={court.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {court.imageUrl ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={court.imageUrl}
                              alt={court.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {court.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {court.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {court.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {court.pricePerHour.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        court.courtStatus === 1 
                          ? 'bg-green-100 text-green-800' 
                          : court.courtStatus === 2
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {court.courtStatus === 1 ? 'Hoạt động' : 
                         court.courtStatus === 2 ? 'Bảo trì' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {court.timeSlots?.length || 0} khung giờ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(court)}
                          disabled={!permissions.canEdit}
                          className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(court)}
                          disabled={!permissions.canDelete}
                          className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                    Giá/giờ (VNĐ) *
                  </label>
                  <input
                    type="number"
                    value={formData.PricePerHour}
                    onChange={(e) => setFormData({...formData, PricePerHour: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ *
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
                  Mô tả
                </label>
                <textarea
                  value={formData.Description}
                  onChange={(e) => setFormData({...formData, Description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <option value={0}>Không hoạt động</option>
                  <option value={1}>Hoạt động</option>
                  <option value={2}>Bảo trì</option>
                </select>
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
