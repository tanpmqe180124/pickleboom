import React, { useState, useEffect } from 'react';
import { showToast } from '@/utils/toastManager';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Save,
  X
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        {courtData.imageUrl ? (
          <img 
            src={courtData.imageUrl} 
            alt={courtData.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <MapPin size={48} />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            courtData.isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {courtData.isAvailable ? 'Có sẵn' : 'Không có sẵn'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{courtData.name}</h3>
        <p className="text-gray-600 text-sm mb-2 flex items-center">
          <MapPin size={16} className="mr-1" />
          {courtData.address}
        </p>
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{courtData.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-green-600">
            {courtData.price.toLocaleString('vi-VN')} VNĐ/giờ
          </span>
          <div className="flex space-x-2">
            <span className="text-xs text-gray-500 self-center mr-2">
              {courtData.created ? new Date(courtData.created).toLocaleString('vi-VN') : ''}
            </span>
            {canEdit && (
              <button
                onClick={() => onEdit(court)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Chỉnh sửa"
              >
                <Edit size={16} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(court)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Xóa"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
// Simple selector for time slots using partnerService.getTimeSlots
const TimeSlotSelector: React.FC<{ selected: string[]; onChange: (ids: string[]) => void }> = ({ selected, onChange }) => {
  const [options, setOptions] = useState<any[]>([]);
  useEffect(() => {
    partnerService.getTimeSlots().then(setOptions).catch(() => setOptions([]));
  }, []);
  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter(x => x !== id));
    else onChange([...selected, id]);
  };
  return (
    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto border rounded p-2">
      {options.map((opt) => (
        <label key={opt.id} className="flex items-center space-x-2 text-sm">
          <input type="checkbox" checked={selected.includes(opt.id)} onChange={() => toggle(opt.id)} />
          <span>{opt.startTime} - {opt.endTime}</span>
        </label>
      ))}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingCourt ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái sân</label>
                <select
                  value={courtStatus}
                  onChange={(e) => setCourtStatus(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Có sẵn</option>
                  <option value={1}>Bảo trì</option>
                  <option value={2}>Không hoạt động</option>
                  <option value={3}>Đầy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Khung giờ (tùy chọn)</label>
                <TimeSlotSelector selected={selectedTimeSlots} onChange={setSelectedTimeSlots} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sân *
                </label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên sân"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  value={formData.Address}
                  onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              {/* Mô tả đã bỏ vì backend không nhận */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá thuê (VNĐ/giờ) *
                </label>
                <input
                  type="number"
                  value={formData.Price}
                  onChange={(e) => setFormData({ ...formData, Price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập giá thuê"
                  min="0"
                />
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
                    console.log('🏟️ File selected:', file);
                    if (file) {
                      setFormData({ ...formData, ImageUrl: file });
                      console.log('🏟️ File set to formData:', file.name, file.size, 'bytes');
                    } else {
                      console.warn('🏟️ No file selected');
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courtToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Xác nhận xóa</h3>
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa sân "{courtToDelete.name}"?
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
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
