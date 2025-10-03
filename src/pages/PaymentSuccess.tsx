import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { useBookingStore } from '@/stores/useBookingStore';
import '../css/payment-success.css';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedTimeSlots = useBookingStore((state) => state.selectedTimeSlots);
  const selectedCourt = useBookingStore((state) => state.selectedCourt);
  const [containerRef, containerInView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.12 });

  // Format date
  let dateString = '';
  if (selectedDate) {
    try {
      if (selectedDate instanceof Date) {
        dateString = selectedDate.toLocaleDateString('vi-VN');
      } else if (typeof selectedDate === 'string' || typeof selectedDate === 'number') {
        const d = new Date(selectedDate);
        if (!isNaN(d.getTime())) {
          dateString = d.toLocaleDateString('vi-VN');
        } else {
          dateString = String(selectedDate);
        }
      }
    } catch {
      dateString = String(selectedDate);
    }
  }

  // Calculate total
  const timeSlots: string[] = Array.isArray(selectedTimeSlots) ? selectedTimeSlots : [];
  const numHours = timeSlots.length;
  const pricePerHour = selectedCourt?.PricePerHour || selectedCourt?.pricePerHour || 0;
  const totalAmount = pricePerHour * numHours;

  // Generate booking ID
  const bookingId = `PB${Date.now().toString().slice(-8)}`;

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
            <p className="booking-id-number">{bookingId}</p>
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
                <span className="detail-value">CN Quy Nhơn</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Sân:</span>
                <span className="detail-value">{selectedCourt?.name || 'Sân 3'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Khu vực:</span>
                <span className="detail-value">{selectedCourt?.location || '86 Nguyễn Quý Anh, Tân Phú'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ngày:</span>
                <span className="detail-value">{dateString}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Giờ chơi:</span>
                <span className="detail-value">{timeSlots.join(', ')}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số giờ:</span>
                <span className="detail-value">{numHours} giờ</span>
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
                <span className="detail-value">{pricePerHour.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số giờ:</span>
                <span className="detail-value">{numHours}</span>
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
                <span className="total-value">{totalAmount.toLocaleString('vi-VN')} ₫</span>
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
