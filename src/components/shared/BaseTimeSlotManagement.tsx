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

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌙';
      default: return '🕐';
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-[1.02] group ${
      timeSlot.isAvailable 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300' 
        : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-300'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
            {getPeriodIcon(period)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {formatTime(timeSlot.startTime)} - {formatTime(timeSlot.endTime)}
              </span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border shadow-sm ${getPeriodColor(period)}`}>
                {period === 'morning' ? '🌅 Sáng' : period === 'afternoon' ? '☀️ Chiều' : '🌙 Tối'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${timeSlot.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${
                timeSlot.isAvailable ? 'text-green-700' : 'text-red-700'
              }`}>
                {timeSlot.isAvailable ? 'Có sẵn' : 'Không khả dụng'}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {timeSlot.startTime} - {timeSlot.endTime}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-1">
          {canEdit && (
            <button
              onClick={() => onEdit(timeSlot)}
              className="p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:shadow-md group/edit"
              title="Chỉnh sửa khung giờ"
            >
              <Edit size={18} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(timeSlot)}
              className="p-3 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all duration-200 hover:shadow-md group/delete"
              title="Xóa khung giờ"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>ID: {timeSlot.id.slice(0, 8)}...</span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            Hoạt động
          </span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                🌅 Buổi sáng ({timePeriods.morning.length} khung giờ)
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                ☀️ Buổi chiều ({timePeriods.afternoon.length} khung giờ)
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                🌙 Buổi tối ({timePeriods.evening.length} khung giờ)
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
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {editingTimeSlot ? 'Chỉnh sửa khung giờ' : 'Thêm khung giờ mới'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {editingTimeSlot ? 'Cập nhật thông tin khung giờ' : 'Tạo khung giờ hoạt động mới'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Time Selection */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="w-1 h-6 bg-purple-600 rounded-full mr-3"></div>
                    Thời gian hoạt động
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giờ bắt đầu *
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={formData.StartTime}
                          onChange={(e) => setFormData({...formData, StartTime: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <Clock size={16} />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giờ kết thúc *
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={formData.EndTime}
                          onChange={(e) => setFormData({...formData, EndTime: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <Clock size={16} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Preview */}
                  {formData.StartTime && formData.EndTime && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Clock className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-900">Xem trước khung giờ:</p>
                          <p className="text-lg font-bold text-purple-700">
                            {(() => {
                              const formatTime = (time: string) => {
                                const [hours, minutes] = time.split(':');
                                const hour = parseInt(hours);
                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                const displayHour = hour % 12 || 12;
                                return `${displayHour}:${minutes} ${ampm}`;
                              };
                              return `${formatTime(formData.StartTime)} - ${formatTime(formData.EndTime)}`;
                            })()}
                          </p>
                          <p className="text-xs text-purple-600">
                            {formData.StartTime} - {formData.EndTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Court Selection (if applicable) */}
                {formData.CourtId !== undefined && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                      Sân áp dụng
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn sân (tùy chọn)
                      </label>
                      <input
                        type="text"
                        value={formData.CourtId}
                        onChange={(e) => setFormData({...formData, CourtId: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Nhập ID sân hoặc để trống"
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>{editingTimeSlot ? 'Cập nhật' : 'Tạo mới'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && timeSlotToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-shrink-0 p-3 bg-red-100 rounded-full">
                  <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Xác nhận xóa khung giờ</h3>
                  <p className="text-sm text-gray-600">
                    Hành động này không thể hoàn tác. Khung giờ sẽ bị xóa vĩnh viễn.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-900 mb-1">Khung giờ sẽ bị xóa:</h4>
                    <p className="text-sm text-red-700 font-medium">
                      {(() => {
                        const formatTime = (time: string) => {
                          const [hours, minutes] = time.split(':');
                          const hour = parseInt(hours);
                          const ampm = hour >= 12 ? 'PM' : 'AM';
                          const displayHour = hour % 12 || 12;
                          return `${displayHour}:${minutes} ${ampm}`;
                        };
                        return `${formatTime(timeSlotToDelete.startTime)} - ${formatTime(timeSlotToDelete.endTime)}`;
                      })()}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      {timeSlotToDelete.startTime} - {timeSlotToDelete.endTime}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang xóa...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Xóa khung giờ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseTimeSlotManagement;

