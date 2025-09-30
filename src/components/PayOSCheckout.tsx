import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService, BookingStatus } from '@/services/paymentService';

interface PayOSCheckoutProps {
  checkoutUrl: string;
  orderCode?: string;
  onSuccess?: (orderCode?: string) => void;
  onCancel?: () => void;
  onExit?: () => void;
  showStatusCheck?: boolean;
}

export default function PayOSCheckout({ 
  checkoutUrl, 
  orderCode,
  onSuccess, 
  onCancel, 
  onExit,
  showStatusCheck = true
}: PayOSCheckoutProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStatus, setShowStatus] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [showManualCheck, setShowManualCheck] = useState(false);

  useEffect(() => {
    if (!checkoutUrl) {
      setError('Thiếu URL thanh toán');
      setIsLoading(false);
      return;
    }

    // Simple iframe approach to avoid PayOS script issues
    setIsLoading(false);
    
    // Hiển thị nút check manual sau 30 giây
    const timer = setTimeout(() => {
      setShowManualCheck(true);
    }, 30000);
    
    return () => clearTimeout(timer);
  }, [checkoutUrl]);

  const handlePaymentSuccess = (orderCode?: string) => {
    setPaymentCompleted(true);
    setShowStatus(false);
    onSuccess?.(orderCode);
  };

  const handlePaymentFailed = () => {
    setShowStatus(false);
    onCancel?.();
  };

  const handlePaymentTimeout = () => {
    setShowStatus(false);
    onCancel?.();
  };

  // Kiểm tra trạng thái booking
  const checkBookingStatus = async () => {
    if (!orderCode) return;
    
    setIsCheckingStatus(true);
    setError(null);
    
    try {
      const status = await paymentService.checkBookingStatus(orderCode);
      setBookingStatus(status);
      
      if (status.status === 'paid') {
        handlePaymentSuccess(orderCode);
      } else if (status.status === 'cancelled') {
        handlePaymentFailed();
      } else {
        alert('Thanh toán chưa hoàn tất. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error checking booking status:', error);
      setError('Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại.');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Bắt đầu polling
  const startPolling = () => {
    if (!orderCode) return;
    
    setShowStatus(true);
    setError(null);
    
    paymentService.pollBookingStatus(
      orderCode,
      (status) => {
        setBookingStatus(status);
        if (status.status === 'paid') {
          handlePaymentSuccess(orderCode);
        } else if (status.status === 'cancelled') {
          handlePaymentFailed();
        }
      },
      20, // 20 lần * 3 giây = 60 giây
      3000 // 3 giây
    ).catch((error) => {
      console.error('Polling error:', error);
      setError('Hết thời gian chờ thanh toán. Vui lòng kiểm tra thủ công.');
    });
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-lg mb-2">⚠️</div>
        <h3 className="text-red-800 font-semibold mb-2">Lỗi thanh toán</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isLoading && (
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giao diện thanh toán...</p>
        </div>
      )}
      
      {!isLoading && !error && !paymentCompleted && (
        <div className="w-full">
          {showStatus && orderCode ? (
            // Polling Status Display
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  Đang kiểm tra trạng thái thanh toán...
                </h3>
                
                {bookingStatus && (
                  <div className="text-sm text-gray-600 mb-4">
                    <p>Mã đơn hàng: <span className="font-mono">{orderCode}</span></p>
                    <p>Trạng thái: <span className="font-semibold">{bookingStatus.status}</span></p>
                  </div>
                )}
                
                <div className="text-xs text-gray-400">
                  Đang kiểm tra mỗi 3 giây...
                </div>
              </div>
            </div>
          ) : (
            <>
              <iframe
                src={checkoutUrl}
                className="w-full h-[600px] border border-gray-200 rounded-lg"
                title="PayOS Checkout"
                allow="payment"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
              />
              
              <div className="mt-4 text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Nếu không thấy giao diện thanh toán, 
                  <a 
                    href={checkoutUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline ml-1"
                  >
                    click vào đây để mở trong tab mới
                  </a>
                </p>
                
                {showStatusCheck && orderCode && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Sau khi thanh toán, bạn có thể kiểm tra trạng thái
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={startPolling}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Tự động kiểm tra trạng thái
                      </button>
                      <button
                        onClick={checkBookingStatus}
                        disabled={isCheckingStatus}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {isCheckingStatus ? 'Đang kiểm tra...' : 'Kiểm tra thủ công'}
                      </button>
                    </div>
                  </div>
                )}
                
                {showManualCheck && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      Bạn đã thanh toán chưa? Hãy kiểm tra trạng thái bên trên.
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onSuccess?.()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Đã thanh toán thành công
                  </button>
                  <button
                    onClick={() => onCancel?.()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Hủy thanh toán
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {paymentCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 text-4xl mb-4">✅</div>
          <h3 className="text-green-800 font-semibold text-lg mb-2">Thanh toán thành công!</h3>
          <p className="text-green-600">Đơn đặt sân của bạn đã được xác nhận.</p>
        </div>
      )}
    </div>
  );
}
