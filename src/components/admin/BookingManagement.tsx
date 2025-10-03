import React, { useState, useEffect } from 'react';
import { adminService, AdminBooking, AdminBookingParams } from '@/services/adminService';
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

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  // ========== FETCH BOOKINGS ==========
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params: AdminBookingParams = {
        Page: currentPage,
        PageSize: pageSize,
        Customer: searchTerm || undefined,
        BookingStatus: statusFilter !== null ? statusFilter : undefined,
      };

      const response = await adminService.getBookings(params);
      setBookings(response.Items);
      setTotalPages(response.TotalPages);
      setTotalCount(response.TotalCount);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showToast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách đặt sân.');
    } finally {
      setLoading(false);
    }
  };

  // ========== HANDLE SEARCH ==========
  const handleSearch = () => {
    setCurrentPage(1);
    fetchBookings();
  };

  // ========== HANDLE FILTER CHANGE ==========
  const handleFilterChange = (status: number | null) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // ========== HANDLE PAGE CHANGE ==========
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // ========== RENDER STATUS BADGE ==========
  const renderBookingStatusBadge = (status: number) => {
    const statusConfig = {
      0: { text: 'Chờ xử lý', class: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      1: { text: 'Đã thanh toán', class: 'bg-green-100 text-green-800', icon: CheckCircle },
      2: { text: 'Đã hủy', class: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig[0];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  // ========== RENDER PAYMENT STATUS BADGE ==========
  const renderPaymentStatusBadge = (status: number) => {
    if (status === 1) {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200">
          <CheckCircle className="h-3 w-3 mr-1.5" />
          Đã thanh toán
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border border-yellow-200">
          <AlertCircle className="h-3 w-3 mr-1.5" />
          Chưa thanh toán
        </span>
      );
    }
  };

  // ========== FORMAT DATE ==========
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ========== FORMAT CURRENCY ==========
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // ========== RENDER PAGINATION ==========
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
            i === currentPage
              ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-md'
              : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Hiển thị {((currentPage - 1) * pageSize) + 1} đến {Math.min(currentPage * pageSize, totalCount)} trong tổng số {totalCount} đặt sân
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-2">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý đặt sân</h2>
            <p className="text-sm text-gray-500">Quản lý lịch đặt sân và thanh toán</p>
          </div>
        </div>
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all duration-200 shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="font-medium">Làm mới</span>
        </button>
      </div>

      {/* ========== SEARCH AND FILTER ========== */}
      <div className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white shadow-sm transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter === null ? '' : statusFilter}
              onChange={(e) => handleFilterChange(e.target.value === '' ? null : parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white shadow-sm transition-all duration-200"
            >
              <option value="">Tất cả trạng thái</option>
              <option value={0}>Chờ xử lý</option>
              <option value={1}>Đã thanh toán</option>
              <option value={2}>Đã hủy</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* ========== BOOKINGS TABLE ========== */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-white animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Không tìm thấy đặt sân nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sân & Ngày
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khung giờ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thanh toán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.Customer}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {booking.Phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {booking.Court}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.BookingDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {booking.TimeSlots.map((timeSlot, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {timeSlot.StartTime}-{timeSlot.EndTime}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {renderPaymentStatusBadge(booking.PaymentStatus)}
                          <div className="text-xs text-gray-500">
                            {booking.PaymentMethod}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderBookingStatusBadge(booking.BookingStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(booking.TotalAmount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(booking.CreatedAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                {renderPagination()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;

