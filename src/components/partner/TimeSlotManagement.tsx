import React, { useState, useEffect } from 'react';
import { partnerService, PartnerTimeSlot, PartnerTimeSlotRequest } from '@/services/partnerService';
import { showToast } from '@/utils/toastManager';
import { useAuth } from '@/contexts/AuthContext';
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
  timeSlot: PartnerTimeSlot;
  onEdit: (timeSlot: PartnerTimeSlot) => void;
  onDelete: (timeSlot: PartnerTimeSlot) => void;
}

const TimeSlotCard: React.FC<TimeSlotCardProps> = ({ timeSlot, onEdit, onDelete }) => {
  const getTimePeriod = (startTime: string) => {
    const hour = parseInt(startTime.substring(0, 2));
    if (hour >= 4 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  };

  const period = getTimePeriod(timeSlot.startTime);
  
  const getPeriodColor = (period: string) => {
    switch (period) {
      case 'morning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'afternoon': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'evening': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌙';
      default: return '🕐';
    }
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return `${Math.round(diffHours * 60)} phút`;
    } else if (diffHours === Math.floor(diffHours)) {
      return `${diffHours} giờ`;
    } else {
      const hours = Math.floor(diffHours);
      const minutes = Math.round((diffHours - hours) * 60);
      return `${hours} giờ ${minutes} phút`;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${getPeriodColor(period)}`}>
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                {timeSlot.startTime} - {timeSlot.endTime}
              </span>
              <span className="text-2xl">{getPeriodIcon(period)}</span>
            </div>
            <p className="text-sm text-gray-600">
              Thời lượng: {calculateDuration(timeSlot.startTime, timeSlot.endTime)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(timeSlot)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Chỉnh sửa khung giờ"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(timeSlot)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Xóa khung giờ"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== ADD/EDIT TIME SLOT MODAL ==========
interface TimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (timeSlot: PartnerTimeSlotRequest) => void;
  editingTimeSlot?: PartnerTimeSlot | null;
  isLoading?: boolean;
}

const TimeSlotModal: React.FC<TimeSlotModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingTimeSlot, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<PartnerTimeSlotRequest>({
    StartTime: '',
    EndTime: ''
  });

  useEffect(() => {
    if (editingTimeSlot) {
      setFormData({
        StartTime: editingTimeSlot.startTime,
        EndTime: editingTimeSlot.endTime
      });
    } else {
      setFormData({
        StartTime: '',
        EndTime: ''
      });
    }
  }, [editingTimeSlot, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.StartTime || !formData.EndTime) {
      showToast.error('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (formData.StartTime >= formData.EndTime) {
      showToast.error('Lỗi', 'Giờ kết thúc phải sau giờ bắt đầu');
      return;
    }

    onSave(formData);
  };

  const calculateDuration = () => {
    if (!formData.StartTime || !formData.EndTime) return '';
    
    const start = new Date(`2000-01-01T${formData.StartTime}`);
    const end = new Date(`2000-01-01T${formData.EndTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return `${Math.round(diffHours * 60)} phút`;
    } else if (diffHours === Math.floor(diffHours)) {
      return `${diffHours} giờ`;
    } else {
      const hours = Math.floor(diffHours);
      const minutes = Math.round((diffHours - hours) * 60);
      return `${hours} giờ ${minutes} phút`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingTimeSlot ? 'Chỉnh sửa khung giờ' : 'Thêm khung giờ mới'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giờ bắt đầu *
            </label>
            <input
              type="time"
              value={formData.StartTime}
              onChange={(e) => setFormData({ ...formData, StartTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giờ kết thúc *
            </label>
            <input
              type="time"
              value={formData.EndTime}
              onChange={(e) => setFormData({ ...formData, EndTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          {formData.StartTime && formData.EndTime && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Thời lượng:</span> {formData.StartTime} - {formData.EndTime}
              </p>
              <p className="text-sm text-blue-600">
                {calculateDuration()}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{editingTimeSlot ? 'Cập nhật' : 'Tạo mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========== MAIN TIME SLOT MANAGEMENT COMPONENT ==========
const TimeSlotManagement: React.FC = () => {
  const { user } = useAuth();
  const [timeSlots, setTimeSlots] = useState<PartnerTimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<PartnerTimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========== LOAD TIME SLOTS ==========
  const loadTimeSlots = async () => {
    try {
      setIsLoading(true);
      // Get partner ID from user context or localStorage
      const partnerId = user?.id || localStorage.getItem('userId') || '00000000-0000-0000-0000-000000000000';
      const data = await partnerService.getTimeSlots(partnerId);
      setTimeSlots(data);
    } catch (error) {
      console.error('Error loading time slots:', error);
      showToast.error('Lỗi', 'Không thể tải danh sách khung giờ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTimeSlots();
  }, []);

  // ========== HANDLERS ==========
  const handleAddTimeSlot = () => {
    setEditingTimeSlot(null);
    setIsModalOpen(true);
  };

  const handleEditTimeSlot = (timeSlot: PartnerTimeSlot) => {
    setEditingTimeSlot(timeSlot);
    setIsModalOpen(true);
  };

  const handleDeleteTimeSlot = async (timeSlot: PartnerTimeSlot) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khung giờ này?')) {
      return;
    }

    try {
      await partnerService.deleteTimeSlot(timeSlot.id);
      showToast.success('Thành công', 'Xóa khung giờ thành công');
      loadTimeSlots();
    } catch (error) {
      console.error('Error deleting time slot:', error);
      showToast.error('Lỗi', 'Không thể xóa khung giờ');
    }
  };

  const handleSaveTimeSlot = async (timeSlotData: PartnerTimeSlotRequest) => {
    try {
      setIsSubmitting(true);
      const partnerId = user?.id || localStorage.getItem('userId') || '00000000-0000-0000-0000-000000000000';
      
      if (editingTimeSlot) {
        // Note: Update not available in backend for TimeSlot
        showToast.error('Lỗi', 'Chức năng cập nhật khung giờ chưa được hỗ trợ');
        return;
      } else {
        await partnerService.createTimeSlot(timeSlotData, partnerId);
        showToast.success('Thành công', 'Tạo khung giờ thành công');
      }
      
      setIsModalOpen(false);
      loadTimeSlots();
    } catch (error) {
      console.error('Error saving time slot:', error);
      showToast.error('Lỗi', 'Không thể lưu khung giờ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== RENDER ==========
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải khung giờ...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý khung giờ</h2>
          <p className="text-gray-600">Thiết lập khung giờ hoạt động cho sân bóng</p>
        </div>
        <button
          onClick={handleAddTimeSlot}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm khung giờ</span>
        </button>
      </div>

      {/* ========== TIME SLOTS LIST ========== */}
      {timeSlots.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khung giờ nào</h3>
          <p className="text-gray-600 mb-4">Hãy thêm khung giờ đầu tiên để bắt đầu</p>
          <button
            onClick={handleAddTimeSlot}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm khung giờ</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {timeSlots.map((timeSlot) => (
            <TimeSlotCard
              key={timeSlot.id}
              timeSlot={timeSlot}
              onEdit={handleEditTimeSlot}
              onDelete={handleDeleteTimeSlot}
            />
          ))}
        </div>
      )}

      {/* ========== MODAL ========== */}
      <TimeSlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTimeSlot}
        editingTimeSlot={editingTimeSlot}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default TimeSlotManagement;
