import React, { useState, useEffect } from 'react';
import { adminService, AdminCourt, AdminCourtRequest, AdminTimeSlot } from '@/services/adminService';
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

const CourtManagement: React.FC = () => {
  const [courts, setCourts] = useState<AdminCourt[]>([]);
  const [timeSlots, setTimeSlots] = useState<AdminTimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCourt, setEditingCourt] = useState<AdminCourt | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [courtToDelete, setCourtToDelete] = useState<AdminCourt | null>(null);
  const [formData, setFormData] = useState<AdminCourtRequest>({
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
      const courtsData = await adminService.getCourts(searchParams);
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
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách sân Pickleball.');
      setCourts([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== FETCH TIME SLOTS ==========
  const fetchTimeSlots = async () => {
    try {
      const timeSlotsData = await adminService.getTimeSlots();
      
      // Ensure timeSlotsData is an array
      if (Array.isArray(timeSlotsData)) {
        setTimeSlots(timeSlotsData);
      } else {
        console.warn('API returned non-array data for time slots:', timeSlotsData);
        setTimeSlots([]);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách khung giờ.');
      setTimeSlots([]);
    }
  };

  // ========== HANDLE FORM SUBMIT ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourt) {
        await adminService.updateCourt(editingCourt.id, formData);
        showToast.success('Cập nhật thành công', 'Sân Pickleball đã được cập nhật.');
      } else {
        await adminService.createCourt(formData);
        showToast.success('Tạo thành công', 'Sân Pickleball mới đã được tạo.');
      }
      
      setShowModal(false);
      setEditingCourt(null);
      resetForm();
      fetchCourts();
      // Notify SelectCourt page to refresh
      localStorage.setItem('courtsUpdated', 'true');
    } catch (error) {
      console.error('Error saving court:', error);
      showToast.error('Lỗi lưu dữ liệu', 'Không thể lưu thông tin sân Pickleball.');
    }
  };

  // ========== HANDLE EDIT ==========
  const handleEdit = (court: AdminCourt) => {
    setEditingCourt(court);
    setFormData({
      Name: court.name,
      Description: court.description,
      Location: court.location,
      PricePerHour: court.pricePerHour,
      CourtStatus: court.courtStatus,
      TimeSlotIDs: court.timeSlotIDs || []  // Ensure TimeSlotIDs is always an array
    });
    setShowModal(true);
  };

  // ========== HANDLE DELETE ==========
  const handleDeleteClick = (court: AdminCourt) => {
    setCourtToDelete(court);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!courtToDelete) return;
    
    try {
      await adminService.deleteCourt(courtToDelete.id);
      showToast.success('Xóa thành công', 'Sân Pickleball đã được xóa.');
      fetchCourts();
      // Notify SelectCourt page to refresh
      localStorage.setItem('courtsUpdated', 'true');
      setShowDeleteModal(false);
      setCourtToDelete(null);
    } catch (error) {
      console.error('Error deleting court:', error);
      showToast.error('Lỗi xóa dữ liệu', 'Không thể xóa sân Pickleball.');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCourtToDelete(null);
  };

  // ========== RESET FORM ==========
  const resetForm = () => {
    setFormData({
      Name: '',
      Description: '',
      Location: '',
      PricePerHour: 0,
      CourtStatus: 0,
      TimeSlotIDs: []
    });
  };

  // ========== HANDLE MODAL CLOSE ==========
  const handleModalClose = () => {
    setShowModal(false);
    setEditingCourt(null);
    resetForm();
  };

  // ========== HANDLE SEARCH ==========
  const handleSearch = () => {
    const searchParams: { Name?: string; CourtStatus?: number } = {};
    
    if (searchTerm.trim()) {
      searchParams.Name = searchTerm.trim();
    }
    
    if (statusFilter !== null) {
      searchParams.CourtStatus = statusFilter;
    }
    
    fetchCourts(searchParams);
  };

  // ========== RENDER STATUS BADGE ==========
  const renderStatusBadge = (status: number) => {
    const statusConfig = {
      0: { text: 'Hoạt động', class: 'bg-green-100 text-green-800' },
      1: { text: 'Bảo trì', class: 'bg-yellow-100 text-yellow-800' },
      2: { text: 'Vô hiệu hóa', class: 'bg-red-100 text-red-800' },
      3: { text: 'Đã kín lịch', class: 'bg-blue-100 text-blue-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig[0];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchCourts();
    fetchTimeSlots();
  }, []);

  return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-2">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý sân Pickleball</h2>
            <p className="text-sm text-gray-500">Quản lý thông tin và trạng thái sân</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchCourts()}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all duration-200 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="font-medium">Làm mới</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">Thêm sân mới</span>
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
              placeholder="Tìm kiếm theo tên sân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white shadow-sm transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter === null ? '' : statusFilter}
              onChange={(e) => {
                const newStatus = e.target.value === '' ? null : parseInt(e.target.value);
                setStatusFilter(newStatus);
                // Auto search when filter changes
                setTimeout(() => {
                  const searchParams: { Name?: string; CourtStatus?: number } = {};
                  if (searchTerm.trim()) {
                    searchParams.Name = searchTerm.trim();
                  }
                  if (newStatus !== null) {
                    searchParams.CourtStatus = newStatus;
                  }
                  fetchCourts(searchParams);
                }, 100);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white shadow-sm transition-all duration-200"
            >
              <option value="">Tất cả trạng thái</option>
              <option value={0}>Hoạt động</option>
              <option value={1}>Bảo trì</option>
              <option value={2}>Vô hiệu hóa</option>
              <option value={3}>Đã kín lịch</option>
            </select>
          </div>

          {/* Search Button */}
          <button 
            onClick={handleSearch}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* ========== COURTS GRID ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-16">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-white animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : courts.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Không có sân Pickleball nào</p>
          </div>
        ) : (
          courts.map((court) => (
            <div key={court.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Court Image */}
              <div className="h-48 bg-gray-200 relative">
                {court.imageUrl ? (
                  <img
                    src={court.imageUrl}
                    alt={court.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  {renderStatusBadge(court.courtStatus)}
                </div>
              </div>

              {/* Court Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{court.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{court.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {court.location}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Giá:</span> {court.pricePerHour.toLocaleString('vi-VN')} VNĐ/giờ
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(court)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(court)}
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCourt ? 'Chỉnh sửa sân Pickleball' : 'Thêm sân Pickleball mới'}
              </h3>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sân *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.Name}
                    onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vị trí *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.Location}
                    onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.Description}
                  onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá thuê/giờ (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.PricePerHour}
                    onChange={(e) => setFormData({ ...formData, PricePerHour: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái *
                  </label>
                  <select
                    value={formData.CourtStatus}
                    onChange={(e) => setFormData({ ...formData, CourtStatus: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={0}>Hoạt động</option>
                    <option value={1}>Bảo trì</option>
                    <option value={2}>Vô hiệu hóa</option>
                    <option value={3}>Đã kín lịch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khung giờ hoạt động
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {timeSlots.map((timeSlot) => (
                    <label key={timeSlot.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.TimeSlotIDs?.includes(timeSlot.id) || false}
                        onChange={(e) => {
                          const currentTimeSlotIDs = formData.TimeSlotIDs || [];
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              TimeSlotIDs: [...currentTimeSlotIDs, timeSlot.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              TimeSlotIDs: currentTimeSlotIDs.filter(id => id !== timeSlot.id)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        {timeSlot.startTime} - {timeSlot.endTime}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh sân
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingCourt ? 'Cập nhật' : 'Tạo mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Xác nhận xóa</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Bạn có chắc chắn muốn xóa sân <span className="font-semibold text-gray-900">"{courtToDelete?.name}"</span>?
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Xóa sân</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtManagement;

