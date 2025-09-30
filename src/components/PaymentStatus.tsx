import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { paymentService, PaymentStatus } from '@/services/paymentService';

interface PaymentStatusProps {
  orderCode: string;
  onPaymentSuccess?: (status: PaymentStatus) => void;
  onPaymentFailed?: (status: PaymentStatus) => void;
  onPaymentTimeout?: () => void;
  maxPollingTime?: number; // in seconds
}

export default function PaymentStatusComponent({
  orderCode,
  onPaymentSuccess,
  onPaymentFailed,
  onPaymentTimeout,
  maxPollingTime = 300 // 5 minutes default
}: PaymentStatusProps) {
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(maxPollingTime);

  useEffect(() => {
    if (!orderCode) return;

    let pollingInterval: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    const startPolling = async () => {
      try {
        setIsPolling(true);
        setError(null);

        // Start countdown
        countdownInterval = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              clearInterval(pollingInterval);
              setIsPolling(false);
              onPaymentTimeout?.();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Start polling
        pollingInterval = setInterval(async () => {
          try {
            const paymentStatus = await paymentService.checkPaymentStatus(orderCode);
            setStatus(paymentStatus);

            if (paymentStatus.status === 'paid') {
              clearInterval(pollingInterval);
              clearInterval(countdownInterval);
              setIsPolling(false);
              onPaymentSuccess?.(paymentStatus);
            } else if (paymentStatus.status === 'cancelled' || paymentStatus.status === 'expired') {
              clearInterval(pollingInterval);
              clearInterval(countdownInterval);
              setIsPolling(false);
              onPaymentFailed?.(paymentStatus);
            }
          } catch (err) {
            console.error('Error checking payment status:', err);
            setError('Không thể kiểm tra trạng thái thanh toán');
          }
        }, 2000); // Check every 2 seconds

      } catch (err) {
        console.error('Error starting payment polling:', err);
        setError('Không thể bắt đầu kiểm tra thanh toán');
        setIsPolling(false);
      }
    };

    startPolling();

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [orderCode, onPaymentSuccess, onPaymentFailed, onPaymentTimeout, maxPollingTime]);

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-8 h-8 text-red-500" />;
    if (!status) return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />;
    
    switch (status.status) {
      case 'paid':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-8 h-8 text-red-500" />;
      case 'expired':
        return <XCircle className="w-8 h-8 text-orange-500" />;
      case 'pending':
      default:
        return <Clock className="w-8 h-8 text-blue-500" />;
    }
  };

  const getStatusText = () => {
    if (error) return 'Lỗi kiểm tra thanh toán';
    if (!status) return 'Đang kiểm tra...';
    
    switch (status.status) {
      case 'paid':
        return 'Thanh toán thành công';
      case 'cancelled':
        return 'Thanh toán đã bị hủy';
      case 'expired':
        return 'Thanh toán đã hết hạn';
      case 'pending':
      default:
        return 'Đang chờ thanh toán';
    }
  };

  const getStatusColor = () => {
    if (error) return 'text-red-600';
    if (!status) return 'text-blue-600';
    
    switch (status.status) {
      case 'paid':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      case 'expired':
        return 'text-orange-600';
      case 'pending':
      default:
        return 'text-blue-600';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {getStatusIcon()}
        </div>
        
        <h3 className={`text-lg font-semibold mb-2 ${getStatusColor()}`}>
          {getStatusText()}
        </h3>
        
        {status && (
          <div className="text-sm text-gray-600 mb-4">
            <p>Mã đơn hàng: <span className="font-mono">{orderCode}</span></p>
            <p>Số tiền: <span className="font-semibold">{status.amount.toLocaleString('vi-VN')} ₫</span></p>
          </div>
        )}
        
        {isPolling && (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang kiểm tra trạng thái thanh toán...</span>
            </div>
            
            <div className="text-xs text-gray-400">
              Thời gian còn lại: {formatTime(timeRemaining)}
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3 mt-4">
            {error}
          </div>
        )}
        
        {status?.status === 'pending' && !isPolling && (
          <div className="text-sm text-orange-600 bg-orange-50 rounded-lg p-3 mt-4">
            Hết thời gian chờ thanh toán. Vui lòng thử lại.
          </div>
        )}
      </div>
    </div>
  );
}
