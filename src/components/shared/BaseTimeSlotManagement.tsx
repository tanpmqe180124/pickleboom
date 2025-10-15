import React, { useState, useEffect } from 'react';
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

// ========== INTERFACES ==========
export interface BaseTimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  courtId?: string;
}

export interface BaseTimeSlotRequest {
  StartTime: string;
  EndTime: string;
  CourtId?: string;
}

interface BaseTimeSlotManagementProps {
  userRole: 'Admin' | 'Partner';
  apiService: {
    getTimeSlots: () => Promise<BaseTimeSlot[]>;
    createTimeSlot: (data: BaseTimeSlotRequest) => Promise<string>;
    updateTimeSlot: (id: string, data: BaseTimeSlotRequest) => Promise<string>;
    deleteTimeSlot: (id: string) => Promise<string>;
  };
  permissions: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
}

// ========== TIME SLOT CARD COMPONENT ==========
interface TimeSlotCardProps {
  timeSlot: BaseTimeSlot;
  onEdit: (timeSlot: BaseTimeSlot) => void;
  onDelete: (timeSlot: BaseTimeSlot) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const TimeSlotCard: React.FC<TimeSlotCardProps> = ({ timeSlot, onEdit, onDelete, canEdit, canDelete }) => {
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

  const getPeriodBackground = (period: string) => {
    switch (period) {
      case 'morning': return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
      case 'afternoon': return 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200';
      case 'evening': return 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getPeriodBackground(period)} ${
      timeSlot.isAvailable 
        ? 'hover:border-opacity-60' 
        : 'opacity-75'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">
                {formatTime(timeSlot.startTime)} - {formatTime(timeSlot.endTime)}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPeriodColor(period)}`}>
                {period === 'morning' ? 'Sáng' : period === 'afternoon' ? 'Chiều' : 'Tối'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {timeSlot.isAvailable ? 'Có sẵn' : 'Không khả dụng'}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {canEdit && (
            <button
              onClick={() => onEdit(timeSlot)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Edit size={16} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(timeSlot)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const BaseTimeSlotManagement: React.FC<BaseTimeSlotManagementProps> = ({
  userRole,
  apiService,
  permissions
}) => {
  const [timeSlots, setTimeSlots] = useState<BaseTimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<BaseTimeSlot | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [timeSlotToDelete, setTimeSlotToDelete] = useState<BaseTimeSlot | null>(null);
  const [formData, setFormData] = useState<BaseTimeSlotRequest>({
    StartTime: '',
    EndTime: '',
    CourtId: ''
  });

  // ========== FETCH TIME SLOTS ==========
  const fetchTimeSlots = async () => {
    setLoading(true);
    try {
      const timeSlotsData = await apiService.getTimeSlots();
      console.log('TimeSlots API Response:', timeSlotsData);
      
      if (Array.isArray(timeSlotsData)) {
        setTimeSlots(timeSlotsData);
      } else {
        console.warn('API returned non-array data:', timeSlotsData);
        setTimeSlots([]);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách khung giờ.');
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchTimeSlots();
  }, []);

  // ========== HANDLERS ==========
  const handleCreate = () => {
    setEditingTimeSlot(null);
    setFormData({
      StartTime: '',
      EndTime: '',
      CourtId: ''
    });
    setShowModal(true);
  };

  const handleEdit = (timeSlot: BaseTimeSlot) => {
    setEditingTimeSlot(timeSlot);
    setFormData({
      StartTime: timeSlot.startTime,
      EndTime: timeSlot.endTime,
      CourtId: timeSlot.courtId || ''
    });
    setShowModal(true);
  };

  const handleDelete = (timeSlot: BaseTimeSlot) => {
    setTimeSlotToDelete(timeSlot);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingTimeSlot) {
        await apiService.updateTimeSlot(editingTimeSlot.id, formData);
        showToast.success('Cập nhật thành công', 'Khung giờ đã được cập nhật.');
      } else {
        await apiService.createTimeSlot(formData);
        showToast.success('Tạo thành công', 'Khung giờ mới đã được tạo.');
      }
      
      setShowModal(false);
      fetchTimeSlots();
    } catch (error) {
      console.error('Error saving time slot:', error);
      showToast.error('Lỗi lưu dữ liệu', 'Không thể lưu khung giờ.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!timeSlotToDelete) return;
    
    setLoading(true);
    try {
      await apiService.deleteTimeSlot(timeSlotToDelete.id);
      showToast.success('Xóa thành công', 'Khung giờ đã được xóa.');
      setShowDeleteModal(false);
      fetchTimeSlots();
    } catch (error) {
      console.error('Error deleting time slot:', error);
      showToast.error('Lỗi xóa dữ liệu', 'Không thể xóa khung giờ.');
    } finally {
      setLoading(false);
    }
  };

  // ========== TIME PERIODS ==========
  const timePeriods = {
    morning: timeSlots.filter(ts => {
      const hour = parseInt(ts.startTime.substring(0, 2));
      return hour >= 4 && hour < 12;
    }),
    afternoon: timeSlots.filter(ts => {
      const hour = parseInt(ts.startTime.substring(0, 2));
      return hour >= 12 && hour < 18;
    }),
    evening: timeSlots.filter(ts => {
      const hour = parseInt(ts.startTime.substring(0, 2));
      return hour >= 18 || hour < 4;
    })
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Quản lý Khung giờ {userRole === 'Partner' ? 'Pickleball' : ''}
        </h2>
        {permissions.canCreate && (
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Thêm khung giờ mới</span>
          </button>
        )}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchTimeSlots}
          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw size={20} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Time Slots by Period */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : timeSlots.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có khung giờ nào</h3>
          <p className="mt-1 text-sm text-gray-500">
            Chưa có khung giờ nào được tạo.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Morning Slots */}
          {timePeriods.morning.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Buổi sáng ({timePeriods.morning.length} khung giờ)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timePeriods.morning.map((timeSlot) => (
                  <TimeSlotCard
                    key={timeSlot.id}
                    timeSlot={timeSlot}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    canEdit={permissions.canEdit}
                    canDelete={permissions.canDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Afternoon Slots */}
          {timePeriods.afternoon.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Buổi chiều ({timePeriods.afternoon.length} khung giờ)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timePeriods.afternoon.map((timeSlot) => (
                  <TimeSlotCard
                    key={timeSlot.id}
                    timeSlot={timeSlot}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    canEdit={permissions.canEdit}
                    canDelete={permissions.canDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Evening Slots */}
          {timePeriods.evening.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Buổi tối ({timePeriods.evening.length} khung giờ)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timePeriods.evening.map((timeSlot) => (
                  <TimeSlotCard
                    key={timeSlot.id}
                    timeSlot={timeSlot}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    canEdit={permissions.canEdit}
                    canDelete={permissions.canDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingTimeSlot ? 'Chỉnh sửa khung giờ' : 'Thêm khung giờ mới'}
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
                  Giờ bắt đầu *
                </label>
                <input
                  type="time"
                  value={formData.StartTime}
                  onChange={(e) => setFormData({...formData, StartTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ kết thúc *
                </label>
                <input
                  type="time"
                  value={formData.EndTime}
                  onChange={(e) => setFormData({...formData, EndTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
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
                  <span>{loading ? 'Đang lưu...' : editingTimeSlot ? 'Cập nhật' : 'Tạo mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && timeSlotToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa khung giờ này?
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

export default BaseTimeSlotManagement;

