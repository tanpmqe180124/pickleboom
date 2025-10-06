import React, { useState, useEffect } from 'react';
import { partnerService, PartnerTimeSlotRequest, PartnerTimeSlot } from '@/services/partnerService';
import { showToast } from '@/utils/toastManager';
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  X,
  RefreshCw
} from 'lucide-react';

const TimeSlotManagement: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<PartnerTimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [timeSlotToDelete, setTimeSlotToDelete] = useState<PartnerTimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState<Omit<PartnerTimeSlotRequest, 'PartnerId'>>({
    StartTime: '',
    EndTime: ''
  });

  // ========== LOAD DATA ==========
  useEffect(() => {
    loadTimeSlots();
  }, []);

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const response = await partnerService.getTimeSlots();
      setTimeSlots(response);
    } catch (error) {
      console.error('Error loading time slots:', error);
      showToast.error('Lỗi', 'Không thể tải danh sách khung giờ');
    } finally {
      setLoading(false);
    }
  };

  // ========== HANDLERS ==========
  const handleOpenModal = () => {
    setFormData({
      StartTime: '',
      EndTime: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      StartTime: '',
      EndTime: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.StartTime || !formData.EndTime) {
      showToast.error('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (formData.StartTime >= formData.EndTime) {
      showToast.error('Lỗi', 'Giờ kết thúc phải sau giờ bắt đầu');
      return;
    }

    try {
      setIsSubmitting(true);
      await partnerService.createTimeSlot(formData);
      showToast.success('Thành công', 'Tạo khung giờ thành công');
      handleCloseModal();
      loadTimeSlots();
    } catch (error: any) {
      console.error('Error creating time slot:', error);
      showToast.error('Lỗi', 'Không thể tạo khung giờ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (timeSlot: PartnerTimeSlot) => {
    setTimeSlotToDelete(timeSlot);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!timeSlotToDelete) return;

    try {
      await partnerService.deleteTimeSlot(timeSlotToDelete.ID);
      showToast.success('Thành công', 'Xóa khung giờ thành công');
      setShowDeleteModal(false);
      setTimeSlotToDelete(null);
      loadTimeSlots();
    } catch (error) {
      console.error('Error deleting time slot:', error);
      showToast.error('Lỗi', 'Không thể xóa khung giờ');
    }
  };

  const getTimePeriod = (startTime: string) => {
    const hour = parseInt(startTime.substring(0, 2));
    if (hour >= 4 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  };

  const getGradientColors = (startTime: string) => {
    const period = getTimePeriod(startTime);
    switch (period) {
      case 'morning':
        return 'from-yellow-50 to-orange-50 border-yellow-200';
      case 'afternoon':
        return 'from-orange-50 to-red-50 border-orange-200';
      default:
        return 'from-purple-50 to-indigo-50 border-purple-200';
    }
  };

  const getIconColors = (startTime: string) => {
    const period = getTimePeriod(startTime);
    switch (period) {
      case 'morning':
        return 'from-yellow-400 to-orange-500';
      case 'afternoon':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-purple-500 to-indigo-500';
    }
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return `${diffHours} giờ`;
  };

  // ========== RENDER ==========
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý khung giờ</h2>
          <p className="text-gray-600">Thiết lập khung giờ hoạt động cho sân bóng</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadTimeSlots}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw size={20} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={handleOpenModal}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
            <span>Thêm khung giờ</span>
          </button>
        </div>
      </div>

      {/* Time Slots List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : timeSlots.length === 0 ? (
        <div className="text-center py-12">
          <Clock size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khung giờ nào</h3>
          <p className="text-gray-600 mb-6">Hãy thêm khung giờ đầu tiên để bắt đầu</p>
          <button
            onClick={handleOpenModal}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto"
          >
            <Plus size={20} />
            <span>Thêm khung giờ</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {timeSlots.map((timeSlot) => (
            <div
              key={timeSlot.ID}
              className={`bg-gradient-to-br ${getGradientColors(timeSlot.StartTime)} rounded-xl p-4 border hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`bg-gradient-to-r ${getIconColors(timeSlot.StartTime)} rounded-full p-2 group-hover:scale-110 transition-transform duration-300`}>
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <button
                  onClick={() => handleDelete(timeSlot)}
                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-105"
                  title="Xóa"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-gray-900">
                  {timeSlot.StartTime} - {timeSlot.EndTime}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {calculateDuration(timeSlot.StartTime, timeSlot.EndTime)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Thêm khung giờ mới</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ bắt đầu *
                  </label>
                  <input
                    type="time"
                    name="StartTime"
                    value={formData.StartTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ kết thúc *
                  </label>
                  <input
                    type="time"
                    name="EndTime"
                    value={formData.EndTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Duration Preview */}
                {formData.StartTime && formData.EndTime && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Thời lượng:</span> {formData.StartTime} - {formData.EndTime}
                    </p>
                    <p className="text-sm text-blue-600">
                      {calculateDuration(formData.StartTime, formData.EndTime)}
                    </p>
                  </div>
                )}

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
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    <span>Tạo mới</span>
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
                Bạn có chắc chắn muốn xóa khung giờ "{timeSlotToDelete?.StartTime} - {timeSlotToDelete?.EndTime}"? Hành động này không thể hoàn tác.
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

export default TimeSlotManagement;


