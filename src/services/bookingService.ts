import { api } from '@/infrastructure/api/axiosClient';

// Types
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface Court {
  id: string; // Backend actually returns id (camelCase)
  name: string; // Backend actually returns name (camelCase)
  location: string; // Backend actually returns location (camelCase)
  pricePerHour: number; // Backend actually returns pricePerHour (camelCase)
  description?: string; // Backend actually returns description (camelCase)
  imageUrl?: string; // Backend actually returns imageUrl (camelCase)
  courtStatus?: number; // Backend actually returns courtStatus (camelCase)
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
  // Lấy tất cả time slots
  async getTimeSlots(): Promise<TimeSlot[]> {
    try {
      const response = await api.get<ApiResponse<TimeSlot[]>>('/TimeSlot');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching time slots:', error);
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

  // Lấy danh sách sân
  async getCourts(page: number = 1, pageSize: number = 6): Promise<{
    data: Court[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const response = await api.get<ApiResponse<{
        data: Court[];
        total: number;
        page: number;
        pageSize: number;
      }>>(`/Court?Page=${page}&PageSize=${pageSize}`);
      
      return response.data.data;
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
      // Lấy tất cả time slots
      const allTimeSlots = await this.getTimeSlots();
      
      // Lấy time slots đã được book
      const bookedTimeSlots = await this.getBookedTimeSlots(courtId, date);
      
      // Filter out booked time slots
      const bookedIds = new Set(bookedTimeSlots.map(slot => slot.id));
      const availableTimeSlots = allTimeSlots.filter(slot => !bookedIds.has(slot.id));
      
      return availableTimeSlots;
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
