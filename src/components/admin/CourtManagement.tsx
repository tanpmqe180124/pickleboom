import React from 'react';
import BaseCourtManagement from '@/components/shared/BaseCourtManagement';
import { adminService } from '@/services/adminService';

const CourtManagement: React.FC = () => {
  return (
    <BaseCourtManagement
      userRole="Admin"
      apiService={{
        getCourts: adminService.getCourts,
        getCourtById: adminService.getCourtById,
        createCourt: adminService.createCourt,
        updateCourt: adminService.updateCourt,
        deleteCourt: adminService.deleteCourt,
        getTimeSlots: adminService.getTimeSlots,
      }}
      permissions={{
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canViewAll: true, // Admin xem tất cả
      }}
    />
  );
};

export default CourtManagement;