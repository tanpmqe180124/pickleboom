import React from 'react';
import BaseTimeSlotManagement from '@/components/shared/BaseTimeSlotManagement';
import { adminService } from '@/services/adminService';

const TimeSlotManagement: React.FC = () => {
  return (
    <BaseTimeSlotManagement
      userRole="Admin"
      apiService={{
        getTimeSlots: adminService.getTimeSlots,
        createTimeSlot: adminService.createTimeSlot,
        updateTimeSlot: adminService.updateTimeSlot,
        deleteTimeSlot: adminService.deleteTimeSlot,
      }}
      permissions={{
        canCreate: true,
        canEdit: true,
        canDelete: true,
      }}
    />
  );
};

export default TimeSlotManagement;