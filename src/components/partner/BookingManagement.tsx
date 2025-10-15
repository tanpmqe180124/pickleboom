import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Phone,
  CalendarDays
} from 'lucide-react';
import { partnerService } from '@/services/partnerService';
import { showToast } from '@/utils/toastManager';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  id: string;
  customer: string;
  phone: string;
  court: string;
  bookingDate: string;
  paymentStatus: number;
  bookingStatus: number; // 0: Free, 1: Pending, 2: Paid, 3: Cancelled
  totalAmount: number;
  createdAt: string;
  bookingTimeSlots: {
    id: string;
    startTime: string;
    endTime: string;
  }[];
}

const BookingManagement: React.FC = () => {
  const { userID } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [customerSearch, setCustomerSearch] = useState<string>('');

  // ========== FETCH BOOKINGS ==========
  const fetchBookings = async () => {
    if (!userID) return;
    
    setLoading(true);
    try {
      // Add pagination and search parameters - match with backend BookingParams
      const params = {
        Page: 1,
        PageSize: 10,
        Customer: customerSearch.trim() || undefined, // Backend expects string or null
        BookingStatus: statusFilter || undefined // Backend expects BookingStatus? or null
      };
      
      const bookingsData = await partnerService.getBookings(userID, params);
      console.log('Bookings API Response:', bookingsData);
      
      if (Array.isArray(bookingsData)) {
        setBookings(bookingsData);
      } else {
        console.warn('API returned non-array data:', bookingsData);
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách đặt sân.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchBookings();
  }, [userID, statusFilter, customerSearch]);

  // ========== HANDLERS ==========
  const handleStatusUpdate = async (bookingId: string, newStatus: number) => {
    setLoading(true);
    try {
      await partnerService.updateBookingStatus(bookingId, newStatus);
      showToast.success('Cập nhật thành công', 'Trạng thái đặt sân đã được cập nhật.');
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      showToast.error('Lỗi cập nhật', 'Không thể cập nhật trạng thái đặt sân.');
    } finally {
      setLoading(false);
    }
  };

  // ========== UTILITY FUNCTIONS ==========
  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Sân trống';
      case 1: return 'Chờ thanh toán';
      case 2: return 'Đã thanh toán';
      case 3: return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-gray-100 text-gray-800';
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0: return <AlertCircle size={16} />;
      case 1: return <AlertCircle size={16} />;
      case 2: return <CheckCircle size={16} />;
      case 3: return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // ========== FILTERED BOOKINGS ==========
  const filteredBookings = bookings.filter(booking => {
    return statusFilter === null || booking.bookingStatus === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Quản lý Đặt sân Pickleball
        </h2>
        <button
          onClick={fetchBookings}
          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw size={20} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm khách hàng
            </label>
            <input
              type="text"
              placeholder="Nhập tên khách hàng..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              <option value="0">Sân trống</option>
              <option value="1">Chờ thanh toán</option>
              <option value="2">Đã thanh toán</option>
              <option value="3">Đã hủy</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setCustomerSearch('');
                setStatusFilter(null);
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có đặt sân nào</h3>
            <p className="mt-1 text-sm text-gray-500">
              {(statusFilter !== null || customerSearch.trim()) 
                ? 'Không tìm thấy đặt sân phù hợp với bộ lọc.' 
                : 'Chưa có đặt sân nào.'}
            </p>
            {(statusFilter !== null || customerSearch.trim()) && (
              <button
                onClick={() => {
                  setCustomerSearch('');
                  setStatusFilter(null);
                }}
                className="mt-3 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search Results Info */}
            {(statusFilter !== null || customerSearch.trim()) && (
              <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
                <p className="text-sm text-blue-700">
                  Hiển thị {filteredBookings.length} kết quả
                  {customerSearch.trim() && ` cho "${customerSearch}"`}
                  {statusFilter !== null && ` với trạng thái "${getStatusText(statusFilter)}"`}
                </p>
              </div>
            )}
            
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <MapPin size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{booking.court}</h3>
                        <p className="text-sm text-gray-600">Sân Pickleball</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                      {getStatusIcon(booking.bookingStatus)}
                      <span className="ml-2">{getStatusText(booking.bookingStatus)}</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{booking.customer}</div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Phone size={14} />
                            <span>{booking.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Calendar size={16} className="text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{formatDate(booking.bookingDate)}</div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock size={14} />
                            <span>
                              {booking.bookingTimeSlots.map(slot => 
                                `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`
                              ).join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <DollarSign size={16} className="text-yellow-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-gray-900">{formatPrice(booking.totalAmount)}</div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <CalendarDays size={14} />
                            <span>{new Date(booking.createdAt).toLocaleString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        {booking.bookingStatus === 0 && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 1)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              Xác nhận
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 3)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              Hủy
                            </button>
                          </>
                        )}
                        {/* Không hiển thị button cho status 1 (Chờ thanh toán) vì PayOS sẽ tự động check */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;