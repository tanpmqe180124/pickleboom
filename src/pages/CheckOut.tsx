
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/checkout.css';
import { ChevronLeft } from "lucide-react";
import { useBookingStore } from '@/stores/useBookingStore';
import { bookingService, BookingRequest } from '@/services/bookingService';
import { paymentService } from '@/services/paymentService';
import { useAuthStore } from '@/infrastructure/storage/tokenStorage';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import PayOSCheckout from '@/components/PayOSCheckout';

export default function CheckOut() {
  const navigate = useNavigate();
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedTimeSlot = useBookingStore((state) => state.selectedTime);
  const selectedTimeSlots = useBookingStore((state) => state.selectedTimeSlots);
  const selectedTimeSlotIds = useBookingStore((state) => state.selectedTimeSlotIds);
  const selectedCourt = useBookingStore((state) => state.selectedCourt);
  const customerName = useBookingStore((state) => state.customerName);
  const { user, isAuthenticated } = useAuthStore();
  
  // Animation states
  const [ref, inView] = useInViewAnimation<HTMLDivElement>({ threshold: 0.12 });
  const [showCard1, setShowCard1] = useState(false);
  const [showCard2, setShowCard2] = useState(false);
  
  // Initialize animations on mount
  useEffect(() => {
    // Show first card immediately
    setShowCard1(true);
    
    // Show second card after a short delay
    const timer = setTimeout(() => {
      setShowCard2(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Effect to restore authentication state if needed
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && (!user?.userId || !isAuthenticated)) {
      console.log('Restoring authentication state...');
      // Try to extract user info from token
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.nameid || payload.sub;
        // console.log('Extracted userId from token:', userId);
        // console.log('Token payload:', payload);
        
        if (userId) {
          const userData = {
            userId: userId,
            role: payload.role?.toLowerCase().replace('role_', ''),
            fullName: payload.unique_name,
            verified: true
          };
          
          useAuthStore.getState().setUser(userData);
          // console.log('Authentication state restored with userData:', userData);
        }
      } catch (error) {
        console.error('Error restoring authentication state:', error);
      }
    }
  }, [user?.userId, isAuthenticated]);

  // selectedTimeSlot là object chứa startTime, endTime
  // selectedDate là số ngày trong tháng
  // selectedCourt là object chứa thông tin sân
  let dateString = '';
  if (selectedDate) {
    try {
      // Nếu selectedDate là Date object
      if (selectedDate instanceof Date) {
        dateString = selectedDate.toLocaleDateString('vi-VN');
      } else if (typeof selectedDate === 'string' || typeof selectedDate === 'number') {
        // Nếu là string hoặc số, chuyển sang Date
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
  // Xử lý nhiều khung giờ
  const timeSlots: string[] = Array.isArray(selectedTimeSlots) ? selectedTimeSlots : [];
  const numHours = timeSlots.length;
  // Lấy tên sân và khu vực từ state, các thông tin khác giữ hardcode
  const courtName = selectedCourt?.name || 'Sân 3';
  const courtLocation = selectedCourt?.location || '86 Nguyễn Quý Anh, Tân Phú';
  const pricePerHour = selectedCourt?.pricePerHour || 0;

  // State and handler for payment
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPayOS, setShowPayOS] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const [bookingCreated, setBookingCreated] = useState(false);
  const [orderCode, setOrderCode] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required data
    if (!selectedDate || !selectedCourt || selectedTimeSlotIds.length === 0) {
      setError('Thiếu thông tin đặt sân. Vui lòng kiểm tra lại.');
      return;
    }

    if (!isAuthenticated || !user?.userId) {
      setError('Vui lòng đăng nhập để đặt sân.');
      return;
    }

    if (!customerName.trim()) {
      setError('Vui lòng nhập tên khách hàng.');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Vui lòng nhập số điện thoại.');
      return;
    }

    if (!email.trim()) {
      setError('Vui lòng nhập email.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Prepare payment request - Match với backend BookingRequest
      const paymentRequest = {
        courtID: selectedCourt.id,
        bookingDate: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        amount: selectedCourt.pricePerHour,
        timeSlots: selectedTimeSlotIds // Array of Guid strings
      };

      // Call payment service to create booking and get payment URL
      const response = await paymentService.createPayment(paymentRequest);
      
      if (response.StatusCode === 200) {
        console.log('Payment created successfully:', response.Data);
        setCheckoutUrl(response.Data.checkoutUrl);
        setOrderCode(response.Data.orderCode.toString());
        setBookingCreated(true);
        setShowPayOS(true);
      } else {
        setError(response.Message || 'Có lỗi xảy ra khi tạo đơn đặt sân.');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Có lỗi xảy ra khi đặt sân. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (orderCode?: string) => {
    console.log('Payment successful!', orderCode);
    navigate('/payment/success');
  };

  const handlePaymentCancel = () => {
    console.log('Payment cancelled');
    setShowPayOS(false);
    setError('Thanh toán đã bị hủy. Bạn có thể thử lại.');
  };

  const handlePaymentExit = () => {
    console.log('Payment exit');
    setShowPayOS(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại</span>
    </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" ref={ref}>
          {/* Left Section - Booking Summary */}
          <div className={`lg:col-span-1 transition-all duration-700 transform ${
            showCard1 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-8'
          }`}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 h-full">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">🎾</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in">Pickle Boom</h1>
                <p className="text-gray-600 animate-fade-in">Dịch vụ đặt sân chuyên nghiệp</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 animate-fade-in">
                    Thông tin đặt lịch
                  </h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Chi nhánh:</span>
                      <span className="font-medium">CN Quy Nhơn</span>
    </div>
                    
                    <div className="flex items-start justify-between">
                      <span className="text-gray-600">
                        Khu vực:
                      </span>
                      <span className="font-medium text-right">{courtLocation}</span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-gray-600">
                        Sân - giờ:
                      </span>
                      <span className="font-medium text-right">
                        {courtName} – {timeSlots.join(', ')}
                        <br />
                        <span className="text-xs text-gray-500">({dateString})</span>
                      </span>
  </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Giá 1 giờ:</span>
                      <span className="font-medium">{pricePerHour.toLocaleString('vi-VN')} ₫</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Số giờ:</span>
                      <span className="font-medium">{numHours}</span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">Tổng:</span>
                        <span className="text-lg font-bold text-blue-600">
                          {(pricePerHour * numHours).toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section - Customer Form or PayOS Checkout */}
          <div className={`lg:col-span-1 transition-all duration-700 transform ${
            showCard2 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-8'
          }`}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 h-full">
              {!showPayOS ? (
                // Customer Form
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in">Thông tin khách hàng</h2>
                    <p className="text-gray-600 animate-fade-in">Vui lòng điền thông tin để hoàn tất đặt sân</p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-red-400 text-xl">⚠️</span>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Lỗi đặt sân</h3>
                          <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form className="space-y-6 animate-fade-in" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label className="text-gray-700 font-medium">
                        Tên người đặt *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => useBookingStore.getState().setCustomerName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
                          placeholder="Nhập tên của bạn"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-700 font-medium">
                        Số điện thoại *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
                          placeholder="Nhập số của bạn"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-700 font-medium">
                        Email *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
                          placeholder="Nhận email để xác nhận sân"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-700 font-medium">
                        Mã khuyến mại (Nếu có)
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="Nhập mã"
                          />
                        </div>
                        <button
                          type="button"
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          Kiểm tra
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`w-full font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 ${
                        isProcessing 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105'
                      } text-white`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Đang tạo đơn đặt sân...
                        </div>
                      ) : (
                        'Xác nhận và thanh toán'
                      )}
                    </button>
                  </form>
                </>
              ) : (
                // PayOS Checkout
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-2xl">💳</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in">Thanh toán</h2>
                    <p className="text-gray-600 animate-fade-in">Vui lòng thanh toán để hoàn tất đặt sân</p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-red-400 text-xl">⚠️</span>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Lỗi thanh toán</h3>
                          <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <PayOSCheckout
                    checkoutUrl={checkoutUrl}
                    orderCode={orderCode}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                    onExit={handlePaymentExit}
                    showStatusCheck={true}
                  />

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowPayOS(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ← Quay lại thông tin khách hàng
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
</div>
  );
}
