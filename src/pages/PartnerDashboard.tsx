import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import BlogManagement from '@/components/partner/BlogManagement';
import CourtManagement from '@/components/partner/CourtManagement';
import TimeSlotManagement from '@/components/partner/TimeSlotManagement';
import BookingManagement from '@/components/partner/BookingManagement';

type PartnerTab = 'blogs' | 'courts' | 'timeslots' | 'bookings';

const PartnerDashboard: React.FC = () => {
  console.log('=== PARTNER DASHBOARD COMPONENT START ===');
  
  // Simple test first
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="text-white text-4xl font-bold">
        TEST PARTNER DASHBOARD
      </div>
    </div>
  );
};

export default PartnerDashboard;