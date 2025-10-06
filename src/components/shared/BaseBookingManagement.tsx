import React, { useState, useEffect } from 'react';
import { showToast } from '@/utils/toastManager';
import { 
  Calendar, 
  RefreshCw,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Phone,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// ========== INTERFACES ==========
export interface BaseBooking {
  id: string;
  courtName: string;
  customerName: string;
  customerPhone?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: number;
  paymentStatus?: number;
  createdAt: string;
}

export interface BaseBookingParams {
  Search?: string;
  PageNumber?: number;
  PageSize?: number;
  Customer?: string;
  BookingStatus?: number;
}

interface BaseBookingManagementProps {
  userRole: 'Admin' | 'Partner';
  apiService: {
    getBookings: (params?: BaseBookingParams) => Promise<{
      items: BaseBooking[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>;
  };
  permissions: {
    canViewAll: boolean;
  };
}

const BaseBookingManagement: React.FC<BaseBookingManagementProps> = ({
  userRole,
  apiService,
  permissions
}) => {
  const [bookings, setBookings] = useState<BaseBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  // ========== FETCH BOOKINGS ==========
  const fetchBookings = async (page: number = 1) => {
    setLoading(true);
    try {
      const params: BaseBookingParams = {
        Search: searchTerm || undefined,
        PageNumber: page,
        PageSize: pageSize,
        Customer: searchTerm || undefined,
        BookingStatus: statusFilter || undefined
      };

      const response = await apiService.getBookings(params);
      console.log('Bookings API Response:', response);
      
      setBookings(response.items || []);
      setTotalCount(response.totalCount || 0);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(response.pageNumber || 1);
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
    fetchBookings(1);
  }, []);

  // ========== HANDLERS ==========
  const handleSearch = () => {
    setCurrentPage(1);
    fetchBookings(1);
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter(null);
    setCurrentPage(1);
    fetchBookings(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBookings(page);
  };

  // ========== STATUS HELPERS ==========
  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return { text: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
      case 1:
        return { text: 'Đã xác nhận', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 2:
        return { text: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle };
      case 3:
        return { text: 'Hoàn thành', color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
      default:
        return { text: 'Không xác định', color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    }
  };

  const getPaymentStatusInfo = (status?: number) => {
    switch (status) {
      case 0:
        return { text: 'Chưa thanh toán', color: 'bg-yellow-100 text-yellow-800' };
      case 1:
        return { text: 'Đã thanh toán', color: 'bg-green-100 text-green-800' };
      case 2:
        return { text: 'Hoàn tiền', color: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Không xác định', color: 'bg-gray-100 text-gray-800' };
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Quản lý Đặt sân {userRole === 'Partner' ? 'Pickleball' : ''}
        </h2>
        <div className="text-sm text-gray-500">
          Tổng cộng: {totalCount} đặt sân
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên khách hàng hoặc sân..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
              <option value="0">Chờ xác nhận</option>
              <option value="1">Đã xác nhận</option>
              <option value="2">Đã hủy</option>
              <option value="3">Hoàn thành</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSearch}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Search size={20} />
              <span>Tìm kiếm</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RefreshCw size={20} />
              <span>Làm mới</span>
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
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có đặt sân nào</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== null 
                ? 'Không tìm thấy đặt sân phù hợp với bộ lọc.' 
                : 'Chưa có đặt sân nào.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày & Giờ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => {
                  const statusInfo = getStatusInfo(booking.status);
                  const paymentInfo = getPaymentStatusInfo(booking.paymentStatus);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.customerName}
                            </div>
                            {booking.customerPhone && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone size={14} className="mr-1" />
                                {booking.customerPhone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{booking.courtName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.bookingDate)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock size={14} className="mr-1" />
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.totalPrice.toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                          <StatusIcon size={12} className="mr-1" />
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${paymentInfo.color}`}>
                          <CreditCard size={12} className="mr-1" />
                          {paymentInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> đến{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalCount)}
                </span>{' '}
                trong tổng số <span className="font-medium">{totalCount}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseBookingManagement;
