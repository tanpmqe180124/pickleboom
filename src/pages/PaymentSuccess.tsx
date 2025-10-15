import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useBookingStore } from '@/stores/useBookingStore';

export default function PaymentSuccess() {
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedTimeSlots = useBookingStore((state) => state.selectedTimeSlots);
  const selectedCourt = useBookingStore((state) => state.selectedCourt);
  const selectedPartner = useBookingStore((state) => state.selectedPartner);
  const availableTimeSlots = useBookingStore((state) => state.availableTimeSlots);
  const selectedTimeSlotIds = useBookingStore((state) => state.selectedTimeSlotIds);

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

  // Format time slots with start and end time
  const formatTimeSlots = () => {
    if (!availableTimeSlots || !selectedTimeSlotIds) return timeSlots.join(', ');
    
    const selectedSlots = availableTimeSlots.filter(slot => 
      selectedTimeSlotIds.includes(slot.id)
    );
    
    return selectedSlots.map(slot => 
      `${slot.startTime.substring(0, 5)} - ${slot.endTime.substring(0, 5)}`
    ).join(', ');
  };

  // Get partner name
  const partnerName = selectedPartner?.bussinessName || 'CN Quy Nhơn';

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
            <span className="font-medium">{selectedCourt?.name || 'Sân 3'} - {formatTimeSlots()}</span>
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
