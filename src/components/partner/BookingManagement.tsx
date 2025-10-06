import React from 'react';
import BaseBookingManagement from '@/components/shared/BaseBookingManagement';
import { partnerService } from '@/services/partnerService';

const BookingManagement: React.FC = () => {
  return (
    <BaseBookingManagement
      userRole="Partner"
      apiService={{
        getBookings: partnerService.getBookings,
      }}
      permissions={{
        canViewAll: false, // Partner chỉ xem đặt sân của sân mình
      }}
    />
  );
};

export default BookingManagement;