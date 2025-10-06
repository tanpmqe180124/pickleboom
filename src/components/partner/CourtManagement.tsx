import React, { useState, useEffect } from 'react';
import { partnerService, PartnerCourtRequest, PartnerCourt, CourtParams } from '@/services/partnerService';
import { showToast } from '@/utils/toastManager';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  X,
  Upload,
  Clock,
  DollarSign,
  Search,
  Filter
} from 'lucide-react';

const CourtManagement: React.FC = () => {
  const [courts, setCourts] = useState<PartnerCourt[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [courtToDelete, setCourtToDelete] = useState<PartnerCourt | null>(null);
  const [editingCourt, setEditingCourt] = useState<PartnerCourt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });

  const [formData, setFormData] = useState<Omit<PartnerCourtRequest, 'PartnerId'>>({
    Name: '',
    Location: '',
    PricePerHour: 0,
    ImageUrl: null as any,
    CourtStatus: 0,
    TimeSlotIDs: []
  });

  // ========== LOAD DATA ==========
  useEffect(() => {
    loadCourts();
    loadTimeSlots();
  }, [pagination.page, searchTerm, statusFilter]);

  const loadCourts = async () => {
    try {
      setLoading(true);
      const params: CourtParams = {
        Page: pagination.page,
        PageSize: pagination.pageSize,
        Name: searchTerm || undefined,
        Status: statusFilter
      };
      const response = await partnerService.getCourts(params);
      setCourts(response.Data);
      setPagination(prev => ({ ...prev, total: response.Total }));
    } catch (error) {
      console.error('Error loading courts:', error);
      showToast.error('Lỗi', 'Không thể tải danh sách sân');
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSlots = async () => {
    try {
      const response = await partnerService.getTimeSlots();
      setTimeSlots(response);
    } catch (error) {
      console.error('Error loading time slots:', error);
    }
  };

  // ========== HANDLERS ==========
  const handleOpenModal = (court?: PartnerCourt) => {
    if (court) {
      setEditingCourt(court);
      setFormData({
        Name: court.Name,
        Location: court.Location,
        PricePerHour: court.PricePerHour,
        ImageUrl: null as any,
        CourtStatus: court.CourtStatus,
        TimeSlotIDs: court.TimeSlotIDs.map(ts => ts.ID)
      });
    } else {
      setEditingCourt(null);
      setFormData({
        Name: '',
        Location: '',
        PricePerHour: 0,
        ImageUrl: null as any,
        CourtStatus: 0,
        TimeSlotIDs: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourt(null);
    setFormData({
      Name: '',
      Location: '',
      PricePerHour: 0,
      ImageUrl: null as any,
      CourtStatus: 0,
      TimeSlotIDs: []
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'PricePerHour' || name === 'CourtStatus' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        showToast.error('Lỗi', 'Chỉ chấp nhận file .jpg, .jpeg, .png');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showToast.error('Lỗi', 'Kích thước file không được vượt quá 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        ImageUrl: file
      }));
    }
  };

  const handleTimeSlotChange = (timeSlotId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      TimeSlotIDs: checked 
        ? [...prev.TimeSlotIDs, timeSlotId]
        : prev.TimeSlotIDs.filter(id => id !== timeSlotId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.Name || formData.Name.length < 3 || formData.Name.length > 100) {
      showToast.error('Lỗi', 'Tên sân phải có độ dài từ 3 đến 100 ký tự');
      return;
    }

    if (!formData.Location || formData.Location.length > 200) {
      showToast.error('Lỗi', 'Địa điểm không được vượt quá 200 ký tự');
      return;
    }

    if (formData.PricePerHour <= 0) {
      showToast.error('Lỗi', 'Giá mỗi giờ phải lớn hơn 0');
      return;
    }

    if (!formData.ImageUrl) {
      showToast.error('Lỗi', 'Vui lòng chọn ảnh sân');
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingCourt) {
        await partnerService.updateCourt(editingCourt.ID, formData);
        showToast.success('Thành công', 'Cập nhật sân thành công');
      } else {
        await partnerService.createCourt(formData);
        showToast.success('Thành công', 'Tạo sân thành công');
      }

      handleCloseModal();
      loadCourts();
    } catch (error: any) {
      console.error('Error saving court:', error);
      showToast.error('Lỗi', 'Không thể lưu sân');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (court: PartnerCourt) => {
    setCourtToDelete(court);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!courtToDelete) return;

    try {
      await partnerService.deleteCourt(courtToDelete.ID);
      showToast.success('Thành công', 'Xóa sân thành công');
      setShowDeleteModal(false);
      setCourtToDelete(null);
      loadCourts();
    } catch (error) {
      console.error('Error deleting court:', error);
      showToast.error('Lỗi', 'Không thể xóa sân');
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Hoạt động';
      case 1: return 'Bảo trì';
      case 2: return 'Không hoạt động';
      case 3: return 'Đã kín lịch';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-green-100 text-green-800';
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-red-100 text-red-800';
      case 3: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ========== RENDER ==========
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý sân Pickleball</h2>
          <p className="text-gray-600">Quản lý sân bóng và thông tin chi tiết</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          <span>Thêm sân mới</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="0">Hoạt động</option>
            <option value="1">Bảo trì</option>
            <option value="2">Không hoạt động</option>
            <option value="3">Đã kín lịch</option>
          </select>
        </div>
      </div>

      {/* Courts List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : courts.length === 0 ? (
        <div className="text-center py-12">
          <MapPin size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sân nào</h3>
          <p className="text-gray-600 mb-6">Hãy thêm sân đầu tiên để bắt đầu</p>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
          >
            <Plus size={20} />
            <span>Thêm sân mới</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <div key={court.ID} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={court.ImageUrl}
                  alt={court.Name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{court.Name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(court.CourtStatus)}`}>
                    {getStatusText(court.CourtStatus)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{court.Location}</p>
                <div className="flex items-center text-green-600 font-semibold mb-3">
                  <DollarSign size={16} className="mr-1" />
                  {court.PricePerHour.toLocaleString()} VNĐ/giờ
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <Clock size={16} className="mr-1" />
                  {court.TimeSlotIDs.length} khung giờ
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(court)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <Edit size={16} />
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => handleDelete(court)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
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

      {/* Pagination */}
      {pagination.total > pagination.pageSize && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="px-3 py-2 text-gray-700">
              Trang {pagination.page} / {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingCourt ? 'Cập nhật sân' : 'Thêm sân mới'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sân *
                  </label>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập tên sân (3-100 ký tự)"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa điểm *
                  </label>
                  <input
                    type="text"
                    name="Location"
                    value={formData.Location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập địa điểm (tối đa 200 ký tự)"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá mỗi giờ (VNĐ) *
                  </label>
                  <input
                    type="number"
                    name="PricePerHour"
                    value={formData.PricePerHour}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập giá mỗi giờ"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ảnh sân *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="court-image-upload"
                      required
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="court-image-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload size={32} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formData.ImageUrl ? formData.ImageUrl.name : 'Chọn ảnh sân'}
                      </span>
                      <span className="text-xs text-gray-500">
                        JPG, PNG (tối đa 5MB)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Court Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="CourtStatus"
                    value={formData.CourtStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isSubmitting}
                  >
                    <option value={0}>Hoạt động</option>
                    <option value={1}>Bảo trì</option>
                    <option value={2}>Không hoạt động</option>
                    <option value={3}>Đã kín lịch</option>
                  </select>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khung giờ
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {timeSlots.map((timeSlot) => (
                      <label key={timeSlot.ID} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.TimeSlotIDs.includes(timeSlot.ID)}
                          onChange={(e) => handleTimeSlotChange(timeSlot.ID, e.target.checked)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-sm text-gray-700">
                          {timeSlot.StartTime} - {timeSlot.EndTime}
                        </span>
                      </label>
                    ))}
                  </div>
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
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    <span>{editingCourt ? 'Cập nhật' : 'Tạo mới'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 rounded-full p-2">
                  <Trash2 size={24} className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa sân "{courtToDelete?.Name}"? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtManagement;


