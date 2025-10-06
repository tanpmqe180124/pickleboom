import React from 'react';
import BaseTimeSlotManagement from '@/components/shared/BaseTimeSlotManagement';
import { partnerService } from '@/services/partnerService';

const TimeSlotManagement: React.FC = () => {
  return (
    <BaseTimeSlotManagement
      userRole="Partner"
      apiService={{
        getTimeSlots: partnerService.getTimeSlots,
        createTimeSlot: partnerService.createTimeSlot,
        updateTimeSlot: partnerService.updateTimeSlot,
        deleteTimeSlot: partnerService.deleteTimeSlot,
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