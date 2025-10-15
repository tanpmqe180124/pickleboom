import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useBookingStore } from '@/stores/useBookingStore';

export default function PaymentSuccess() {
  const location = useLocation();
  const bookingData = location.state?.bookingData;
  
  // Use data from checkout if available, otherwise fallback to store
  const partnerName = bookingData?.partnerName || useBookingStore((state) => state.selectedPartner?.bussinessName) || 'CN Quy Nhơn';
  const courtName = bookingData?.courtName || useBookingStore((state) => state.selectedCourt?.name) || 'Sân 3';
  const timeSlots = bookingData?.timeSlots || '';
  const dateString = bookingData?.date || '';
  const numHours = bookingData?.numHours || 0;
  const totalAmount = bookingData?.totalAmount || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        {/* Success Icon & Message */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
          <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã đặt sân tại Pickle Boom.
          </p>
        </div>


        {/* Booking Details */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Chi nhánh:</span>
            <span className="font-medium">{partnerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sân - giờ:</span>
            <span className="font-medium">{courtName} - {timeSlots}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ngày:</span>
            <span className="font-medium">{dateString}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số giờ:</span>
            <span className="font-medium">{numHours} giờ</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-gray-600 font-medium">Tổng cộng:</span>
            <span className="font-bold text-lg">{totalAmount.toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>

      </div>
    </div>
  );
}
