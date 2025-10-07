import React, { useState, useEffect } from 'react';
import { adminService, AdminTimeSlot, AdminTimeSlotRequest } from '@/services/adminService';
import { showToast } from '@/utils/toastManager';
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Save,
  X
} from 'lucide-react';

// ========== TIME SLOT CARD COMPONENT ==========
interface TimeSlotCardProps {
  timeSlot: AdminTimeSlot;
  onEdit: (timeSlot: AdminTimeSlot) => void;
  onDelete: (timeSlot: AdminTimeSlot) => void;
}

const TimeSlotCard: React.FC<TimeSlotCardProps> = ({ timeSlot, onEdit, onDelete }) => {
  const getTimePeriod = (startTime: string) => {
    const hour = parseInt(startTime.substring(0, 2));
    if (hour >= 4 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  };

  const period = getTimePeriod(timeSlot.startTime);
  
  const getGradientColors = () => {
    switch (period) {
      case 'morning':
        return 'from-yellow-50 to-orange-50 border-yellow-200';
      case 'afternoon':
        return 'from-orange-50 to-red-50 border-orange-200';
      default:
        return 'from-purple-50 to-indigo-50 border-purple-200';
    }
  };

  const getIconColors = () => {
    switch (period) {
      case 'morning':
        return 'from-yellow-400 to-orange-500';
      case 'afternoon':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-purple-500 to-indigo-500';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getGradientColors()} rounded-xl p-4 border hover:shadow-lg transition-all duration-300 group`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`bg-gradient-to-r ${getIconColors()} rounded-full p-2 group-hover:scale-110 transition-transform duration-300`}>
          <Clock className="h-4 w-4 text-white" />
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(timeSlot)}
            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-105"
            title="Chỉnh sửa"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDelete(timeSlot)}
            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-105"
            title="Xóa"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-lg font-bold text-gray-900">
          {timeSlot.startTime.substring(0, 5)} - {timeSlot.endTime.substring(0, 5)}
        </div>
        <div className="text-xs text-gray-600 font-medium">
          {(() => {
            const start = new Date(`2000-01-01T${timeSlot.startTime}`);
            const end = new Date(`2000-01-01T${timeSlot.endTime}`);
            const diffMs = end.getTime() - start.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            return `${diffHours} giờ`;
          })()}
        </div>
      </div>
    </div>
  );
};

const TimeSlotManagement: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<AdminTimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [timeSlotToDelete, setTimeSlotToDelete] = useState<AdminTimeSlot | null>(null);
  const [formData, setFormData] = useState<AdminTimeSlotRequest>({
    StartTime: '',
    EndTime: ''
  });

  // ========== FETCH TIME SLOTS ==========
  const fetchTimeSlots = async () => {
    setLoading(true);
    try {
      const response = await adminService.getTimeSlots();
      // Sort time slots by start time
      const sortedTimeSlots = response.sort((a, b) => {
        const timeA = new Date(`2000-01-01T${a.startTime}`).getTime();
        const timeB = new Date(`2000-01-01T${b.startTime}`).getTime();
        return timeA - timeB;
      });
      setTimeSlots(sortedTimeSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách khung giờ.');
    } finally {
      setLoading(false);
    }
  };

  // ========== HANDLE FORM SUBMIT ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate time slots
    if (formData.StartTime >= formData.EndTime) {
      showToast.error('Lỗi dữ liệu', 'Giờ bắt đầu phải nhỏ hơn giờ kết thúc.');
      return;
    }

    try {
      // Convert time format from HH:mm to HH:mm:ss for API
      const apiData = {
        StartTime: formData.StartTime + ':00',
        EndTime: formData.EndTime + ':00'
      };

      // Create new time slot
      await adminService.createTimeSlot(apiData);
      showToast.success('Tạo thành công', 'Khung giờ mới đã được tạo.');
      
      setShowModal(false);
      resetForm();
      fetchTimeSlots();
    } catch (error: any) {
      console.error('Error saving time slot:', error);
      console.error('Error response:', error.response?.data);
      
      // Show specific error message from backend
      const errorMessage = error.response?.data?.Message || 'Không thể lưu thông tin khung giờ.';
      showToast.error('Lỗi lưu dữ liệu', errorMessage);
    }
  };

  // ========== HANDLE EDIT ==========
  const handleEdit = (timeSlot: AdminTimeSlot) => {
    showToast.info('Thông báo', 'Chức năng chỉnh sửa khung giờ chưa được hỗ trợ. Vui lòng xóa và tạo mới.');
  };

  // ========== HANDLE DELETE CLICK ==========
  const handleDeleteClick = (timeSlot: AdminTimeSlot) => {
    setTimeSlotToDelete(timeSlot);
    setShowDeleteModal(true);
  };

  // ========== CONFIRM DELETE ==========
  const handleConfirmDelete = async () => {
    if (!timeSlotToDelete) return;
    
    try {
      await adminService.deleteTimeSlot(timeSlotToDelete.id);
      showToast.success('Xóa thành công', 'Khung giờ đã được xóa.');
      fetchTimeSlots();
      setShowDeleteModal(false);
      setTimeSlotToDelete(null);
    } catch (error) {
      console.error('Error deleting time slot:', error);
      showToast.error('Lỗi xóa dữ liệu', 'Không thể xóa khung giờ.');
    }
  };

  // ========== CANCEL DELETE ==========
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTimeSlotToDelete(null);
  };

  // ========== RESET FORM ==========
  const resetForm = () => {
    setFormData({
      StartTime: '',
      EndTime: ''
    });
  };

  // ========== HANDLE MODAL CLOSE ==========
  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  // ========== GENERATE TIME OPTIONS ==========
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchTimeSlots();
  }, []);

  return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Quản lý khung giờ</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchTimeSlots}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm khung giờ mới</span>
          </button>
        </div>
      </div>

      {/* ========== TIME SLOTS GRID ========== */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Không có khung giờ nào</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Morning Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 mr-3">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Buổi sáng (04:00 - 12:00)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {timeSlots
                  .filter(timeSlot => {
                    const hour = parseInt(timeSlot.startTime.substring(0, 2));
                    return hour >= 4 && hour < 12;
                  })
                  .map((timeSlot) => (
                    <TimeSlotCard 
                      key={timeSlot.id} 
                      timeSlot={timeSlot} 
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))}
              </div>
            </div>

            {/* Afternoon Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2 mr-3">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Buổi chiều (12:00 - 18:00)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {timeSlots
                  .filter(timeSlot => {
                    const hour = parseInt(timeSlot.startTime.substring(0, 2));
                    return hour >= 12 && hour < 18;
                  })
                  .map((timeSlot) => (
                    <TimeSlotCard 
                      key={timeSlot.id} 
                      timeSlot={timeSlot} 
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))}
              </div>
            </div>

            {/* Evening Section */}
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-2 mr-3">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Buổi tối (18:00 - 22:00)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {timeSlots
                  .filter(timeSlot => {
                    const hour = parseInt(timeSlot.startTime.substring(0, 2));
                    return hour >= 18 && hour < 22;
                  })
                  .map((timeSlot) => (
                    <TimeSlotCard 
                      key={timeSlot.id} 
                      timeSlot={timeSlot} 
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========== MODAL ========== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-lg p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Thêm khung giờ mới
                </h3>
                <button
                  onClick={handleModalClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ bắt đầu *
                  </label>
                  <select
                    required
                    value={formData.StartTime}
                    onChange={(e) => setFormData({ ...formData, StartTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Chọn giờ bắt đầu</option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ kết thúc *
                  </label>
                  <select
                    required
                    value={formData.EndTime}
                    onChange={(e) => setFormData({ ...formData, EndTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Chọn giờ kết thúc</option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration Display */}
              {formData.StartTime && formData.EndTime && formData.StartTime < formData.EndTime && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">
                      Thời lượng: {formData.StartTime} - {formData.EndTime}
                    </span>
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    {(() => {
                      const start = new Date(`2000-01-01T${formData.StartTime}`);
                      const end = new Date(`2000-01-01T${formData.EndTime}`);
                      const diffMs = end.getTime() - start.getTime();
                      const diffHours = diffMs / (1000 * 60 * 60);
                      return `${diffHours} giờ`;
                    })()}
                  </div>
                </div>
              )}

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
                  className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Tạo mới</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== DELETE CONFIRMATION MODAL ========== */}
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
                Bạn có chắc chắn muốn xóa khung giờ <span className="font-semibold text-gray-900">"{timeSlotToDelete?.startTime.substring(0, 5)} - {timeSlotToDelete?.endTime.substring(0, 5)}"</span>?
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
                <span>Xóa khung giờ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotManagement;

