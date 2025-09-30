import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { paymentService, BookingStatus } from '@/services/paymentService';
import { useAuthStore } from '@/infrastructure/storage/tokenStorage';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';

export default function MyBookings() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState<BookingStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [containerRef, containerInView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.1 });

  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      navigate('/login');
      return;
    }
    loadBookings();
  }, [isAuthenticated, user?.userId, navigate]);

  const loadBookings = async () => {
    if (!user?.userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const userBookings = await paymentService.getUserBookings(user.userId);
      setBookings(userBookings);
    } catch (err: any) {
      console.error('Error loading bookings:', err);
      setError(err.message || 'Không thể tải danh sách đặt sân');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đặt sân này?')) return;
    
    try {
      await paymentService.cancelBooking(bookingId);
      await loadBookings(); // Reload to update status
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      alert(err.message || 'Không thể hủy đặt sân');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'cancelled':
        return 'Đã hủy';
      case 'pending':
      default:
        return 'Chờ thanh toán';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách đặt sân...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 transition-all duration-700 ${
        containerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt sân của tôi</h1>
              <p className="text-gray-600">Quản lý và theo dõi các đặt sân của bạn</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đặt sân nào</h3>
            <p className="text-gray-600 mb-6">Hãy đặt sân đầu tiên của bạn!</p>
            <button
              onClick={() => navigate('/playertype')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đặt sân ngay
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(booking.status)}
                          <span>{getStatusText(booking.status)}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Mã đặt sân: <span className="font-mono">{booking.id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {booking.totalAmount.toLocaleString('vi-VN')} ₫
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Ngày: {formatDate(booking.bookingDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          Giờ: {booking.timeSlots.map(slot => formatTime(slot.startTime)).join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">Sân: {booking.courtId}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Khách hàng:</span> {booking.customerName}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">SĐT:</span> {booking.phoneNumber}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {booking.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Số giờ: {booking.timeSlots.length} giờ
                    </div>
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm"
                      >
                        Hủy đặt sân
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
}
