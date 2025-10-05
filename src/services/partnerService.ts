import { api } from '@/infrastructure/api/axiosClient';

// ========== TYPES ==========
export interface PartnerCourt {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerHour: number;
  imageUrl: string;
  courtStatus: number; // 0: Available, 1: UnderMaintenance, 2: Inactive, 3: Full
  timeSlotIDs: string[];
}

export interface PartnerCourtRequest {
  Name: string;
  Description: string;
  Location: string;
  PricePerHour: number;
  ImageUrl?: File;
  CourtStatus: number;
  TimeSlotIDs: string[];
}

export interface PartnerTimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface PartnerTimeSlotRequest {
  StartTime: string;
  EndTime: string;
}

export interface PartnerBlog {
  ID: string;
  Title: string;
  Content: string;
  UserID: string;
  ThumbnailUrl: string;
  BlogStatus: number; // 0: Draft, 1: Published, 2: Hidden
  CreatedAt: string;
}

export interface PartnerBlogRequest {
  Title: string;
  Content: string;
  UserID: string;
  ThumbnailUrl?: File;
  BlogStatus: number;
}

export interface PartnerBooking {
  ID: string;
  Customer: string;
  Phone: string;
  Court: string;
  BookingDate: string;
  PaymentStatus: number;
  BookingStatus: number;
  TotalAmount: number;
  PaymentMethod: string;
  CreatedAt: string;
  TimeSlots: PartnerTimeSlot[];
}

export interface PartnerBookingParams {
  Page: number;
  PageSize: number;
  Customer?: string;
  BookingStatus?: number;
}

export interface ApiResponse<T> {
  Message: string;
  StatusCode: number;
  Data: T;
}

export interface PaginatedResponse<T> {
  Items: T[];
  TotalCount: number;
  Page: number;
  PageSize: number;
  TotalPages: number;
}

// ========== PARTNER SERVICE ==========
export const partnerService = {
  // ========== COURT MANAGEMENT ==========
  async getCourts(partnerId: string, params?: { Name?: string; CourtStatus?: number }): Promise<PartnerCourt[]> {
    try {
      const requestParams = {
        id: partnerId,
        Name: params?.Name,
        Status: params?.CourtStatus
      };
      console.log('getCourts requestParams being sent:', requestParams);
      const response = await api.get<ApiResponse<PartnerCourt[]>>('/Partner/court', { params: requestParams });
      console.log('getCourts raw response:', response);
      console.log('response.data:', response.data);
      
      // Handle response structure
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.warn('Unexpected API response structure for courts:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching courts:', error);
      throw error;
    }
  },

  async getCourtById(courtId: string): Promise<PartnerCourt> {
    try {
      const response = await api.get<ApiResponse<PartnerCourt>>(`/Partner/court/${courtId}`);
      return response.data.Data || response.data;
    } catch (error) {
      console.error('Error fetching court by id:', error);
      throw error;
    }
  },

  async createCourt(courtData: PartnerCourtRequest): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('Name', courtData.Name);
      formData.append('Description', courtData.Description);
      formData.append('Location', courtData.Location);
      formData.append('PricePerHour', courtData.PricePerHour.toString());
      formData.append('CourtStatus', courtData.CourtStatus.toString());
      
      if (courtData.ImageUrl) {
        formData.append('ImageUrl', courtData.ImageUrl);
      }
      
      courtData.TimeSlotIDs.forEach(id => {
        formData.append('TimeSlotIDs', id);
      });

      const response = await api.post<ApiResponse<string>>('/Partner/court', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.Message;
    } catch (error) {
      console.error('Error creating court:', error);
      throw error;
    }
  },

  async updateCourt(courtId: string, courtData: PartnerCourtRequest): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('Name', courtData.Name);
      formData.append('Description', courtData.Description);
      formData.append('Location', courtData.Location);
      formData.append('PricePerHour', courtData.PricePerHour.toString());
      formData.append('CourtStatus', courtData.CourtStatus.toString());
      
      if (courtData.ImageUrl) {
        formData.append('ImageUrl', courtData.ImageUrl);
      }
      
      courtData.TimeSlotIDs.forEach(id => {
        formData.append('TimeSlotIDs', id);
      });

      const response = await api.put<ApiResponse<string>>(`/Partner/court/${courtId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.Message;
    } catch (error) {
      console.error('Error updating court:', error);
      throw error;
    }
  },

  async deleteCourt(courtId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(`/Partner/court/${courtId}`);
      return response.data.Message;
    } catch (error) {
      console.error('Error deleting court:', error);
      throw error;
    }
  },

  // ========== TIMESLOT MANAGEMENT ==========
  async getTimeSlots(partnerId: string): Promise<PartnerTimeSlot[]> {
    try {
      const response = await api.get<ApiResponse<PartnerTimeSlot[]>>('/Partner/timeslot', { 
        params: { id: partnerId } 
      });
      console.log('getTimeSlots raw response:', response);
      console.log('response.data:', response.data);
      
      // Handle response structure
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.warn('Unexpected API response structure for time slots:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw error;
    }
  },

  async createTimeSlot(timeSlotData: PartnerTimeSlotRequest, partnerId: string): Promise<string> {
    try {
      const requestData = {
        ...timeSlotData,
        PartnerId: partnerId
      };
      const response = await api.post<ApiResponse<string>>('/Partner/timeslot', requestData);
      return response.data.Message;
    } catch (error) {
      console.error('Error creating time slot:', error);
      throw error;
    }
  },

  async deleteTimeSlot(timeSlotId: string): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(`/Partner/timeslot/${timeSlotId}`);
      return response.data.Message;
    } catch (error) {
      console.error('Error deleting time slot:', error);
      throw error;
    }
  },

  // ========== BLOG MANAGEMENT ==========
  async createBlog(blogData: PartnerBlogRequest): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('Title', blogData.Title);
      formData.append('Content', blogData.Content);
      formData.append('UserID', blogData.UserID);
      formData.append('BlogStatus', blogData.BlogStatus.toString());
      
      if (blogData.ThumbnailUrl) {
        formData.append('ThumbnailUrl', blogData.ThumbnailUrl);
      }

      const response = await api.post<ApiResponse<string>>('/Partner/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.Message;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  async updateBlog(blogId: string, blogData: PartnerBlogRequest): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('Title', blogData.Title);
      formData.append('Content', blogData.Content);
      formData.append('UserID', blogData.UserID);
      formData.append('BlogStatus', blogData.BlogStatus.toString());
      
      if (blogData.ThumbnailUrl) {
        formData.append('ThumbnailUrl', blogData.ThumbnailUrl);
      }

      const response = await api.put<ApiResponse<string>>(`/Partner/blog/${blogId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.Message;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  // ========== BOOKING MANAGEMENT ==========
  async getBookings(partnerId: string, params: PartnerBookingParams): Promise<PaginatedResponse<PartnerBooking>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<PartnerBooking>>>(`/Partner/booking/${partnerId}`, { params });
      return response.data.Data || response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // ========== UTILITY FUNCTIONS ==========
  async checkPartnerRole(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      console.log('JWT payload:', payload);
      console.log('Role from JWT:', role);
      console.log('Available claims:', Object.keys(payload));
      
      return role?.toLowerCase() === 'partner';
    } catch (error) {
      console.error('Error checking partner role:', error);
      return false;
    }
  }
};

export default partnerService;
