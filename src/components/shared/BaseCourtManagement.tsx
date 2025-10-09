import React, { useState, useEffect } from 'react';
import { showToast } from '@/utils/toastManager';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Save,
  X,
  Clock
} from 'lucide-react';
import { partnerService } from '@/services/partnerService';

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
  Price: number;
  ImageUrl?: File | string;
}

interface BaseCourtManagementProps {
  userRole: 'Admin' | 'Partner';
  apiService: {
    getCourts: () => Promise<any[]>; // Sử dụng any[] để linh hoạt với cả BaseCourt[] và PartnerCourt[]
    getCourtById: (id: string) => Promise<any>;
    createCourt: (data: any) => Promise<string>; // Sử dụng any để linh hoạt với cả BaseCourtRequest và PartnerCourtRequest
    updateCourt: (id: string, data: any) => Promise<string>;
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
  court: any; // Sử dụng any để linh hoạt với cả BaseCourt và PartnerCourt
  onEdit: (court: any) => void;
  onDelete: (court: any) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const CourtCard: React.FC<CourtCardProps> = ({ court, onEdit, onDelete, canEdit, canDelete }) => {
  // Map dữ liệu từ PartnerCourt sang BaseCourt format
  const courtData = {
    id: court.id,
    name: court.name,
    address: court.location || court.address, // PartnerCourt dùng location, BaseCourt dùng address
    description: court.description,
    price: court.pricePerHour || court.price, // PartnerCourt dùng pricePerHour, BaseCourt dùng price
    imageUrl: court.imageUrl,
    isAvailable: court.courtStatus === 0 || court.isAvailable, // PartnerCourt dùng courtStatus, BaseCourt dùng isAvailable
    created: court.created || court.createdAt
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02] group">
      {/* Image Section */}
      <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {courtData.imageUrl ? (
          <img 
            src={courtData.imageUrl} 
            alt={courtData.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <MapPin size={64} className="mx-auto mb-2" />
              <p className="text-sm font-medium">Chưa có hình ảnh</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
            courtData.isAvailable 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {courtData.isAvailable ? '🟢 Có sẵn' : '🔴 Không có sẵn'}
          </span>
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {courtData.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 flex items-start">
            <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{courtData.address}</span>
          </p>
          {courtData.description && (
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{courtData.description}</p>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-600">
              {courtData.price.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-gray-500">VNĐ/giờ</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {courtData.created && (
              <span className="text-xs text-gray-500 hidden sm:block">
                {new Date(courtData.created).toLocaleDateString('vi-VN')}
              </span>
            )}
            <div className="flex space-x-1">
            {canEdit && (
              <button
                onClick={() => onEdit(court)}
                  className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md"
                  title="Chỉnh sửa sân"
              >
                  <Edit size={18} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(court)}
                  className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md"
                  title="Xóa sân"
              >
                  <Trash2 size={18} />
              </button>
            )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>ID: {courtData.id.slice(0, 8)}...</span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
              Hoạt động
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
// Enhanced selector for time slots using partnerService.getTimeSlots
const TimeSlotSelector: React.FC<{ selected: string[]; onChange: (ids: string[]) => void }> = ({ selected, onChange }) => {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    partnerService.getTimeSlots()
      .then(setOptions)
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, []);
  
  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter(x => x !== id));
    else onChange([...selected, id]);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTimePeriod = (startTime: string) => {
    const hour = parseInt(startTime.substring(0, 2));
    if (hour >= 4 && hour < 12) return { period: 'morning', icon: '🌅', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    if (hour >= 12 && hour < 18) return { period: 'afternoon', icon: '☀️', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    return { period: 'evening', icon: '🌙', color: 'bg-purple-100 text-purple-800 border-purple-200' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Đang tải khung giờ...</span>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="text-center py-6">
        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Chưa có khung giờ nào</p>
        <p className="text-xs text-gray-400">Tạo khung giờ trước khi chọn cho sân</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Chọn khung giờ hoạt động</p>
        <span className="text-xs text-gray-500">{selected.length} đã chọn</span>
      </div>
      
      <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
        {options.map((opt) => {
          const timeInfo = getTimePeriod(opt.startTime);
          const isSelected = selected.includes(opt.id);
          
          return (
            <label 
              key={opt.id} 
              className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'bg-blue-50 border-blue-300 shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <input 
                type="checkbox" 
                checked={isSelected} 
                onChange={() => toggle(opt.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{timeInfo.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatTime(opt.startTime)} - {formatTime(opt.endTime)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {opt.startTime} - {opt.endTime}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${timeInfo.color}`}>
                  {timeInfo.period === 'morning' ? 'Sáng' : timeInfo.period === 'afternoon' ? 'Chiều' : 'Tối'}
                </span>
              </div>
        </label>
          );
        })}
      </div>
      
      {selected.length > 0 && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Đã chọn:</strong> {selected.length} khung giờ
          </p>
        </div>
      )}
    </div>
  );
};

const BaseCourtManagement: React.FC<BaseCourtManagementProps> = ({
  userRole,
  apiService,
  permissions
}) => {
  console.log('🏟️ BaseCourtManagement component rendered with userRole:', userRole);
  
  // ========== STATE ==========
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCourt, setEditingCourt] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [courtToDelete, setCourtToDelete] = useState<any | null>(null);
  const [formData, setFormData] = useState<BaseCourtRequest>({
    Name: '',
    Address: '',
    Price: 0,
    ImageUrl: ''
  });
  const [courtStatus, setCourtStatus] = useState<number>(0);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

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
      Price: 0,
      ImageUrl: ''
    });
    setCourtStatus(0);
    setSelectedTimeSlots([]);
    setShowModal(true);
  };

  const handleEdit = (court: any) => {
    setEditingCourt(court);
    setFormData({
      Name: court.name,
      Address: court.location || court.address, // Map location -> address
      Price: court.pricePerHour || court.price, // Map pricePerHour -> price
      ImageUrl: court.imageUrl
    });
    setCourtStatus(typeof court.courtStatus === 'number' ? court.courtStatus : (court.isAvailable ? 0 : 2));
    setShowModal(true);
  };

  const handleDelete = (court: any) => {
    setCourtToDelete(court);
    setShowDeleteModal(true);
  };

  const handleSave = async () => {
    if (!formData.Name || !formData.Address || formData.Price <= 0 || !(formData.ImageUrl instanceof File)) {
      showToast.error('Lỗi dữ liệu', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    try {
      // Map dữ liệu từ BaseCourtRequest sang PartnerCourtRequest
      const partnerCourtData = {
        Name: formData.Name,
        Location: formData.Address, // Map Address -> Location
        PricePerHour: formData.Price,
        ImageUrl: formData.ImageUrl as File | undefined,
        CourtStatus: courtStatus,
        TimeSlotIDs: selectedTimeSlots
      };

      console.log('🏟️ PartnerCourtData before sending:', {
        ...partnerCourtData,
        ImageUrl: partnerCourtData.ImageUrl ? `${partnerCourtData.ImageUrl.name} (${partnerCourtData.ImageUrl.size} bytes)` : 'No file'
      });

      if (editingCourt) {
        await apiService.updateCourt(editingCourt.id, partnerCourtData);
        showToast.success('Cập nhật thành công', 'Sân đã được cập nhật.');
      } else {
        await apiService.createCourt(partnerCourtData);
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
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                {editingCourt ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
              </h2>
                    <p className="text-sm text-gray-500">
                      {editingCourt ? 'Cập nhật thông tin sân Pickleball' : 'Tạo sân Pickleball mới'}
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
            <div className="p-6 space-y-6">
              {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                  Thông tin cơ bản
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sân *
                </label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Nhập tên sân"
                />
              </div>

              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá thuê (VNĐ/giờ) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.Price}
                        onChange={(e) => setFormData({ ...formData, Price: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Nhập giá thuê"
                        min="0"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        VNĐ
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  value={formData.Address}
                  onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Nhập địa chỉ sân"
                />
                </div>
              </div>

              {/* Status and Time Slots */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <div className="w-1 h-6 bg-green-600 rounded-full mr-3"></div>
                  Cài đặt hoạt động
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái sân</label>
                  <select
                    value={courtStatus}
                    onChange={(e) => setCourtStatus(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value={0}>🟢 Có sẵn</option>
                    <option value={1}>🔧 Bảo trì</option>
                    <option value={2}>🔴 Không hoạt động</option>
                    <option value={3}>🟡 Đầy</option>
                  </select>
                </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khung giờ hoạt động (tùy chọn)</label>
                  <div className="border border-gray-300 rounded-xl p-4 bg-gray-50">
                    <TimeSlotSelector selected={selectedTimeSlots} onChange={setSelectedTimeSlots} />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <div className="w-1 h-6 bg-purple-600 rounded-full mr-3"></div>
                  Hình ảnh sân
                </h3>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tải lên hình ảnh
                </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    console.log('🏟️ File selected:', file);
                    if (file) {
                      setFormData({ ...formData, ImageUrl: file });
                      console.log('🏟️ File set to formData:', file.name, file.size, 'bytes');
                    } else {
                      console.warn('🏟️ No file selected');
                    }
                  }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="p-3 bg-blue-100 rounded-full mb-3">
                          <MapPin className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="text-blue-600 font-medium">Nhấn để chọn</span> hoặc kéo thả hình ảnh
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Lưu sân</span>
                    </>
                  )}
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courtToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-shrink-0 p-3 bg-red-100 rounded-full">
                  <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Xác nhận xóa sân</h3>
                  <p className="text-sm text-gray-600">
                    Hành động này không thể hoàn tác. Sân và tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              </div>
              <div>
                    <h4 className="font-medium text-red-900 mb-1">Sân sẽ bị xóa:</h4>
                    <p className="text-sm text-red-700 font-medium">"{courtToDelete.name}"</p>
                    <p className="text-xs text-red-600 mt-1">
                      Địa chỉ: {courtToDelete.location || courtToDelete.address}
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
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang xóa...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Xóa sân</span>
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

export default BaseCourtManagement;
