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
  bookingStatus: number; // 0: Pending, 1: Confirmed, 2: Cancelled, 3: Completed
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

  // ========== FETCH BOOKINGS ==========
  const fetchBookings = async () => {
    if (!userID) return;
    
    setLoading(true);
    try {
      // Add pagination parameters
      const params = {
        Page: 1,
        PageSize: 10,
        BookingStatus: statusFilter
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
  }, [userID, statusFilter]);

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
      case 0: return 'Chờ xác nhận';
      case 1: return 'Đã xác nhận';
      case 2: return 'Đã hủy';
      case 3: return 'Hoàn thành';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-red-100 text-red-800';
      case 3: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0: return <AlertCircle size={16} />;
      case 1: return <CheckCircle size={16} />;
      case 2: return <XCircle size={16} />;
      case 3: return <CheckCircle size={16} />;
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
              Trạng thái
            </label>
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="0">Chờ xác nhận</option>
              <option value="1">Đã xác nhận</option>
              <option value="2">Đã hủy</option>
              <option value="3">Hoàn thành</option>
            </select>
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
              {statusFilter !== null 
                ? 'Không tìm thấy đặt sân phù hợp với bộ lọc.' 
                : 'Chưa có đặt sân nào.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.court}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                        {getStatusIcon(booking.bookingStatus)}
                        <span className="ml-1">{getStatusText(booking.bookingStatus)}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User size={16} />
                        <div>
                          <div className="font-medium">{booking.customer}</div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Phone size={12} />
                            <span>{booking.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>{formatDate(booking.bookingDate)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>
                          {booking.bookingTimeSlots.map(slot => 
                            `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`
                          ).join(', ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign size={16} />
                        <span className="font-medium">{formatPrice(booking.totalAmount)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CalendarDays size={16} />
                        <div>
                          <div className="text-xs text-gray-500">Tạo lúc:</div>
                          <div className="text-xs">{new Date(booking.createdAt).toLocaleString('vi-VN')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    {booking.bookingStatus === 0 && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 1)}
                          className="px-3 py-1 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          Xác nhận
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 2)}
                          className="px-3 py-1 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Hủy
                        </button>
                      </>
                    )}
                    {booking.bookingStatus === 1 && (
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 3)}
                        className="px-3 py-1 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Hoàn thành
                      </button>
                    )}
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