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
  CalendarDays,
  Eye,
  Download,
  BarChart3,
  MoreVertical,
  Trash2
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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showStatistics, setShowStatistics] = useState<boolean>(false);
  const [statistics, setStatistics] = useState<any>(null);

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

  const handleViewDetails = async (booking: Booking) => {
    try {
      const details = await partnerService.getBookingById(booking.id);
      setSelectedBooking(details);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải chi tiết đặt sân.');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đặt sân này?')) return;
    
    setLoading(true);
    try {
      await partnerService.cancelBooking(bookingId);
      showToast.success('Hủy thành công', 'Đặt sân đã được hủy.');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showToast.error('Lỗi hủy', 'Không thể hủy đặt sân.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportBookings = async () => {
    if (!userID) return;
    
    try {
      const blob = await partnerService.exportBookings(userID, {
        status: statusFilter,
        page: 1,
        pageSize: 1000
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bookings_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast.success('Xuất thành công', 'File Excel đã được tải xuống.');
    } catch (error) {
      console.error('Error exporting bookings:', error);
      showToast.error('Lỗi xuất file', 'Không thể xuất danh sách đặt sân.');
    }
  };

  const handleShowStatistics = async () => {
    if (!userID) return;
    
    try {
      const stats = await partnerService.getBookingStatistics(userID);
      setStatistics(stats);
      setShowStatistics(true);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      showToast.error('Lỗi tải thống kê', 'Không thể tải dữ liệu thống kê.');
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
        <div className="flex space-x-3">
          <button
            onClick={handleShowStatistics}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BarChart3 size={20} />
            <span>Thống kê</span>
          </button>
          <button
            onClick={handleExportBookings}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={20} />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={fetchBookings}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={20} />
            <span>Làm mới</span>
          </button>
        </div>
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
          <div className="space-y-4">
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
                      <div className="space-y-3">
                        {/* Status Update Buttons */}
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
                          {booking.bookingStatus === 1 && (
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 2)}
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              Hoàn thành
                            </button>
                          )}
                        </div>

                        {/* Additional Actions */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
                          >
                            <Eye size={16} />
                            <span>Chi tiết</span>
                          </button>
                          {(booking.bookingStatus === 0 || booking.bookingStatus === 1) && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
                            >
                              <Trash2 size={16} />
                              <span>Hủy</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Chi tiết đặt sân</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User size={20} className="mr-2 text-blue-600" />
                  Thông tin khách hàng
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Tên khách hàng</label>
                    <p className="font-medium">{selectedBooking.customer}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Số điện thoại</label>
                    <p className="font-medium">{selectedBooking.phone}</p>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar size={20} className="mr-2 text-green-600" />
                  Thông tin đặt sân
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Sân</label>
                    <p className="font-medium">{selectedBooking.court}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ngày đặt</label>
                    <p className="font-medium">{formatDate(selectedBooking.bookingDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Khung giờ</label>
                    <p className="font-medium">
                      {selectedBooking.bookingTimeSlots.map(slot => 
                        `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`
                      ).join(', ')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Tổng tiền</label>
                    <p className="font-medium text-green-600">{formatPrice(selectedBooking.totalAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Status & Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Clock size={20} className="mr-2 text-yellow-600" />
                  Trạng thái & Thời gian
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Trạng thái</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedBooking.bookingStatus)}`}>
                        {getStatusIcon(selectedBooking.bookingStatus)}
                        <span className="ml-2">{getStatusText(selectedBooking.bookingStatus)}</span>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Thời gian tạo</label>
                    <p className="font-medium">{new Date(selectedBooking.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStatistics && statistics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Thống kê đặt sân</h3>
                <button
                  onClick={() => setShowStatistics(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{statistics.total || 0}</div>
                  <div className="text-sm text-gray-600">Tổng đặt sân</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{statistics.confirmed || 0}</div>
                  <div className="text-sm text-gray-600">Đã xác nhận</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{statistics.pending || 0}</div>
                  <div className="text-sm text-gray-600">Chờ xác nhận</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{statistics.cancelled || 0}</div>
                  <div className="text-sm text-gray-600">Đã hủy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;