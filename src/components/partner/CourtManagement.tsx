import React from 'react';
import BaseCourtManagement from '@/components/shared/BaseCourtManagement';
import { partnerService } from '@/services/partnerService';

const CourtManagement: React.FC = () => {
  return (
    <BaseCourtManagement
      userRole="Partner"
      apiService={{
        getCourts: partnerService.getCourts,
        getCourtById: partnerService.getCourtById,
        createCourt: partnerService.createCourt,
        updateCourt: partnerService.updateCourt,
        deleteCourt: partnerService.deleteCourt,
        getTimeSlots: partnerService.getTimeSlots,
      }}
      permissions={{
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canViewAll: false, // Partner chỉ xem sân của mình
      }}
    />
  );
};

export default CourtManagement;