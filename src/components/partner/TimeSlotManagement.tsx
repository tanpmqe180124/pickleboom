import React from 'react';
import BaseTimeSlotManagement from '@/components/shared/BaseTimeSlotManagement';
import { partnerService } from '@/services/partnerService';

const TimeSlotManagement: React.FC = () => {
  return (
    <BaseTimeSlotManagement
      userRole="Partner"
      apiService={{
        getTimeSlots: partnerService.getTimeSlots,
        createTimeSlot: async (data: any) => {
          const partnerData = {
            StartTime: data.StartTime,
            EndTime: data.EndTime,
            CourtId: data.CourtId || ''
          };
          return partnerService.createTimeSlot(partnerData);
        },
        updateTimeSlot: async (id: string, data: any) => {
          const partnerData = {
            StartTime: data.StartTime,
            EndTime: data.EndTime,
            CourtId: data.CourtId || ''
          };
          return partnerService.createTimeSlot(partnerData); // Backend không có update, dùng create
        },
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