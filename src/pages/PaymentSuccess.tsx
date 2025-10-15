import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, Calendar, Clock, MapPin, CreditCard, Loader2 } from 'lucide-react';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { useBookingStore } from '@/stores/useBookingStore';
import { paymentService, BookingStatusResponse } from '@/services/paymentService';
import { showToast } from '@/utils/toastManager';
import '../css/payment-success.css';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [containerRef, containerInView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.12 });
  
  // State for API data
  const [bookingData, setBookingData] = useState<BookingStatusResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get orderCode from URL params
  const orderCode = searchParams.get('orderCode');
  
  // Fallback data from store (if API fails)
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedTimeSlots = useBookingStore((state) => state.selectedTimeSlots);
  const selectedCourt = useBookingStore((state) => state.selectedCourt);

  // Fetch booking data from API
  useEffect(() => {
    const fetchBookingData = async () => {
      if (!orderCode) {
        setError('Không tìm thấy mã đơn hàng');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await paymentService.checkBookingStatus(orderCode);
        console.log('Booking data from API:', response.data);
        
        if (response.statusCode === 200) {
          setBookingData(response.data);
        } else {
          throw new Error(response.message || 'Không thể tải thông tin đặt sân');
        }
      } catch (err: any) {
        console.error('Error fetching booking data:', err);
        setError(err.message || 'Không thể tải thông tin đặt sân');
        showToast.error('Lỗi tải dữ liệu', 'Không thể tải thông tin đặt sân từ server');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [orderCode]);

  // Calculate data - use API data if available, fallback to store data
  const displayData = bookingData ? {
    orderCode: bookingData.orderCode,
    courtName: bookingData.courtName,
    bookingDate: bookingData.bookingDate,
    customerName: bookingData.customerName,
    phoneNumber: bookingData.phoneNumber,
    email: bookingData.email,
    totalAmount: bookingData.totalAmount,
    status: bookingData.bookingStatus,
    createdAt: bookingData.createdAt
  } : {
    orderCode: orderCode || `PB${Date.now().toString().slice(-8)}`,
    courtName: selectedCourt?.name || 'Sân Pickleball',
    bookingDate: selectedDate ? new Date(selectedDate).toLocaleDateString('vi-VN') : '',
    customerName: 'Khách hàng',
    phoneNumber: '',
    email: '',
    totalAmount: (selectedCourt?.pricePerHour || 0) * (selectedTimeSlots?.length || 1),
    status: 2, // Paid
    createdAt: new Date().toISOString()
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  // Format price
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  useEffect(() => {
    // Auto redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleNewBooking = () => {
    navigate('/playertype');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Đang tải thông tin đặt sân...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`payment-success-container flex flex-col items-center justify-center min-h-screen py-8 transition-all duration-700 ${containerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Success Card */}
        <div className="success-card">
          {/* Success Icon */}
          <div className="success-icon">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Cảm ơn bạn đã đặt sân tại Pickle Boom. Chúng tôi sẽ gửi email xác nhận đến bạn.
          </p>

          {/* Booking ID */}
          <div className="booking-id-card">
            <p className="text-sm text-blue-600 font-medium">Mã đặt sân</p>
            <p className="booking-id-number">{displayData.orderCode}</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left - Booking Summary */}
          <div className="details-card">
            <h3 className="details-header">
              <Calendar className="w-5 h-5 text-blue-600" />
              Thông tin đặt sân
            </h3>
            <div className="space-y-3">
              <div className="detail-row">
                <span className="detail-label">Chi nhánh:</span>
                <span className="detail-value">{displayData.courtName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Sân:</span>
                <span className="detail-value">{displayData.courtName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Khu vực:</span>
                <span className="detail-value">{selectedCourt?.location || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ngày:</span>
                <span className="detail-value">{formatDate(displayData.bookingDate)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Giờ chơi:</span>
                <span className="detail-value">
                  {bookingData ? 'Đã xác nhận' : (timeSlots.join(', ') || 'Đang xử lý')}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số giờ:</span>
                <span className="detail-value">{bookingData ? '1' : numHours} giờ</span>
              </div>
            </div>
          </div>

          {/* Right - Payment Summary */}
          <div className="details-card">
            <h3 className="details-header">
              <CreditCard className="w-5 h-5 text-green-600" />
              Thông tin thanh toán
            </h3>
            <div className="space-y-3">
              <div className="detail-row">
                <span className="detail-label">Giá 1 giờ:</span>
                <span className="detail-value">{formatPrice(displayData.totalAmount)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số giờ:</span>
                <span className="detail-value">{bookingData ? '1' : numHours}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phí dịch vụ:</span>
                <span className="detail-value">0 ₫</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Khuyến mãi:</span>
                <span className="detail-value text-green-600">-0 ₫</span>
              </div>
              <div className="total-row">
                <span className="total-label">Tổng cộng:</span>
                <span className="total-value">{formatPrice(displayData.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="notes-card">
          <h3 className="notes-header">
            <Clock className="w-5 h-5" />
            Lưu ý quan trọng
          </h3>
          <ul className="notes-list">
            <li className="notes-item">
              <span className="notes-bullet">•</span>
              <span>Vui lòng đến sân đúng giờ đã đặt. Nếu muốn hủy, vui lòng liên hệ trước 2 giờ.</span>
            </li>
            <li className="notes-item">
              <span className="notes-bullet">•</span>
              <span>Mang theo CMND/CCCD để xác nhận thông tin khi đến sân.</span>
            </li>
            <li className="notes-item">
              <span className="notes-bullet">•</span>
              <span>Email xác nhận sẽ được gửi đến bạn trong vòng 5 phút.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={handleBackToHome}
            className="action-button action-button-primary"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </button>
          <button
            onClick={handleNewBooking}
            className="action-button action-button-secondary"
          >
            <Calendar className="w-5 h-5" />
            Đặt sân mới
          </button>
        </div>

        {/* Auto redirect notice */}
        <p className="auto-redirect">
          Tự động chuyển về trang chủ sau <span className="auto-redirect-countdown">10 giây</span>
        </p>
      </div>
    </div>
  );
}
