import React, { useState, useEffect } from 'react';
import { partnerService, PartnerBooking, BookingParams } from '@/services/partnerService';
import { showToast } from '@/utils/toastManager';
import { 
  Calendar, 
  Search,
  Filter,
  RefreshCw,
  User,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Eye
} from 'lucide-react';

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<PartnerBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });

  // ========== LOAD DATA ==========
  useEffect(() => {
    loadBookings();
  }, [pagination.page, searchTerm, statusFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const params: BookingParams = {
        Page: pagination.page,
        PageSize: pagination.pageSize,
        Customer: searchTerm || undefined,
        BookingStatus: statusFilter
      };
      const response = await partnerService.getBookings(params);
      setBookings(response.Data);
      setPagination(prev => ({ ...prev, total: response.Total }));
    } catch (error) {
      console.error('Error loading bookings:', error);
      showToast.error('Lỗi', 'Không thể tải danh sách đặt sân');
    } finally {
      setLoading(false);
    }
  };

  // ========== HANDLERS ==========
  const getBookingStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Trống';
      case 1: return 'Chờ xác nhận';
      case 2: return 'Đã thanh toán';
      case 3: return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getBookingStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-gray-100 text-gray-800';
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Chưa thanh toán';
      case 1: return 'Đã thanh toán';
      case 2: return 'Thanh toán thất bại';
      case 3: return 'Hết hạn';
      case 4: return 'Đã hoàn tiền';
      default: return 'Không xác định';
    }
  };

  const getPaymentStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-red-100 text-red-800';
      case 3: return 'bg-gray-100 text-gray-800';
      case 4: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ========== RENDER ==========
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý đặt sân</h2>
          <p className="text-gray-600">Xem và quản lý lịch đặt sân</p>
        </div>
        <button
          onClick={loadBookings}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw size={20} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="0">Trống</option>
            <option value="1">Chờ xác nhận</option>
            <option value="2">Đã thanh toán</option>
            <option value="3">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đặt sân nào</h3>
          <p className="text-gray-600">Khách hàng chưa đặt sân nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.ID} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{booking.Customer}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(booking.BookingStatus)}`}>
                      {getBookingStatusText(booking.BookingStatus)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.PaymentStatus)}`}>
                      {getPaymentStatusText(booking.PaymentStatus)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Phone size={16} />
                      <span>{booking.Phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{booking.Court}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{formatDate(booking.BookingDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      {booking.TotalAmount.toLocaleString()} VNĐ
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDateTime(booking.CreatedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              {booking.BookingTimeSlots && booking.BookingTimeSlots.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Khung giờ đã đặt:</h4>
                  <div className="flex flex-wrap gap-2">
                    {booking.BookingTimeSlots.map((timeSlot, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        <Clock size={14} />
                        <span>{timeSlot.StartTime} - {timeSlot.EndTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Trước
            </button>
            <span className="px-3 py-2 text-gray-700">
              Trang {pagination.page} / {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {bookings.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đặt sân</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.reduce((sum, booking) => sum + booking.TotalAmount, 0).toLocaleString()} VNĐ
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-2 mr-3">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.BookingStatus === 1).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
