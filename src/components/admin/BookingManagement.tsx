import React from 'react';
import BaseBookingManagement from '@/components/shared/BaseBookingManagement';
import { adminService } from '@/services/adminService';

const BookingManagement: React.FC = () => {
  return (
    <BaseBookingManagement
      userRole="Admin"
      apiService={{
        getBookings: adminService.getBookings,
      }}
      permissions={{
        canViewAll: true, // Admin xem tất cả
      }}
    />
  );
};

export default BookingManagement;