import { api } from '@/infrastructure/api/axiosClient';

// Types
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status?: number; // Backend returns 0=Free, 1=Booked, 2=Cancelled
}

export interface Court {
  id: string; // Backend actually returns id (camelCase)
  name: string; // Backend actually returns name (camelCase)
  location?: string; // Backend GetAllInSpecificDate doesn't return location
  pricePerHour?: number; // Backend GetAllInSpecificDate doesn't return pricePerHour
  description?: string; // Backend actually returns description (camelCase)
  imageUrl?: string; // Backend actually returns imageUrl (camelCase)
  courtStatus?: number; // Backend actually returns courtStatus (camelCase)
  timeSlotIDs?: TimeSlot[]; // Backend returns TimeSlotIDs
}

export interface BookingRequest {
  userID: string;
  courtID: string;
  bookingDate: string; // YYYY-MM-DD format
  customerName: string;
  amount: number;
  timeSlots: string[]; // Array of time slot IDs
}

export interface BookingResponse {
  message: string;
  statusCode: number;
  data: {
    checkoutUrl: string;
    orderCode: string;
  };
}

export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}

// API Service Functions
export const bookingService = {
  // Lấy danh sách partners
  async getPartners(): Promise<any[]> {
    try {
      const response = await api.get<ApiResponse<any[]>>('/Common/courts');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching partners:', error);
      throw error;
    }
  },

  // Lấy sân + time slots của partner trong ngày cụ thể
  async getCourtsByPartnerAndDate(partnerId: string, date: string): Promise<any[]> {
    try {
      const response = await api.get<ApiResponse<any[]>>(`/Common/courts/${partnerId}?date=${date}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching courts by partner and date:', error);
      throw error;
    }
  },

  // Lấy time slots đã được book cho sân cụ thể trong ngày
  async getBookedTimeSlots(courtId: string, date: string): Promise<TimeSlot[]> {
    try {
      const response = await api.get<ApiResponse<TimeSlot[]>>(`/TimeSlot/${courtId}?date=${date}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching booked time slots:', error);
      throw error;
    }
  },

  // Lấy danh sách sân từ Common endpoint
  async getCourts(page: number = 1, pageSize: number = 6): Promise<{
    data: Court[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    try {
      // Lấy danh sách partner trước
      const partnersResponse = await api.get<ApiResponse<any[]>>('/Common/courts');
      const partners = partnersResponse.data.data;
      
      // Tạo danh sách sân giả lập từ thông tin partner
      const courts: Court[] = partners.map((partner, index) => ({
        id: partner.id || `court-${index}`,
        name: partner.bussinessName || `Sân ${index + 1}`,
        location: partner.address || 'Địa chỉ chưa cập nhật',
        pricePerHour: 100000 + (index * 50000), // Giá giả lập
        description: `Sân Pickleball tại ${partner.bussinessName}`,
        imageUrl: 'https://via.placeholder.com/300x200?text=Court',
        courtStatus: 0 // Mặc định là hoạt động
      }));
      
      // Phân trang frontend
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedCourts = courts.slice(startIndex, endIndex);
      
      return {
        data: paginatedCourts,
        total: courts.length,
        page,
        pageSize
      };
    } catch (error) {
      console.error('Error fetching courts:', error);
      throw error;
    }
  },

  // Tạo booking và thanh toán
  async createBooking(bookingData: BookingRequest): Promise<BookingResponse> {
    try {
      const response = await api.post<BookingResponse>('/Payment', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Helper function: Lấy available time slots
  async getAvailableTimeSlots(courtId: string, date: string): Promise<TimeSlot[]> {
    try {
      // Lấy time slots đã được book
      const bookedTimeSlots = await this.getBookedTimeSlots(courtId, date);
      
      // For now, return empty array since we don't have getAllTimeSlots method
      // This should be implemented based on your backend API
      return [];
    } catch (error) {
      console.error('Error getting available time slots:', error);
      throw error;
    }
  },

  // Helper function: Map time string to time slot ID
  mapTimeStringToSlotId(timeString: string, timeSlots: TimeSlot[]): string | null {
    const slot = timeSlots.find(ts => ts.startTime === timeString);
    return slot ? slot.id : null;
  },

  // Helper function: Map time slot IDs to time strings
  mapSlotIdsToTimeStrings(slotIds: string[], timeSlots: TimeSlot[]): string[] {
    return slotIds
      .map(id => {
        const slot = timeSlots.find(ts => ts.id === id);
        return slot ? slot.startTime : null;
      })
      .filter((time): time is string => time !== null);
  }
};

export default bookingService;
