import { api } from './api';

// ========== TYPES ==========
export interface PartnerBlogRequest {
  Title: string;
  Content: string;
  ParnerID: string; // Note: typo in backend
  ThumbnailUrl: File;
  BlogStatus: 0 | 1 | 2; // Draft=0, Published=1, Hidden=2
}

export interface PartnerCourtRequest {
  PartnerId: string;
  Name: string;
  Location: string;
  PricePerHour: number;
  ImageUrl: File;
  CourtStatus: 0 | 1 | 2 | 3; // Available=0, UnderMaintenance=1, Inactive=2, Full=3
  TimeSlotIDs: string[];
}

export interface PartnerTimeSlotRequest {
  PartnerId: string;
  StartTime: string; // "HH:mm" format
  EndTime: string;   // "HH:mm" format
}

export interface PartnerBlog {
  ID: string;
  Title: string;
  Content: string;
  ThumbnailUrl: string;
  Status: 0 | 1 | 2;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface PartnerCourt {
  ID: string;
  Name: string;
  Location: string;
  PricePerHour: number;
  ImageUrl: string;
  CourtStatus: 0 | 1 | 2 | 3;
  Created: string;
  TimeSlotIDs: PartnerTimeSlot[];
}

export interface PartnerTimeSlot {
  ID: string;
  StartTime: string;
  EndTime: string;
  Status: number;
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
  CreatedAt: string;
  BookingTimeSlots: PartnerBookingTimeSlot[];
}

export interface PartnerBookingTimeSlot {
  Id: string;
  StartTime: string;
  EndTime: string;
}

export interface PartnerApiResponse<T> {
  Message: string;
  StatusCode: number;
  Data?: T;
}

export interface PartnerPaginatedResponse<T> {
  Page: number;
  PageSize: number;
  Total: number;
  Data: T[];
}

export interface CourtParams {
  Page: number;
  PageSize: number;
  Name?: string;
  Status?: number;
}

export interface BookingParams {
  Page: number;
  PageSize: number;
  Customer?: string;
  BookingStatus?: number;
}

// ========== HELPER FUNCTIONS ==========
const getPartnerId = (): string => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return '';
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.nameid || '';
  } catch (error) {
    console.error('Error getting PartnerId from token:', error);
    return '';
  }
};

// ========== PARTNER SERVICE ==========
export const partnerService = {
  // ========== BLOG MANAGEMENT ==========
  async createBlog(blogData: Omit<PartnerBlogRequest, 'ParnerID'>): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('Title', blogData.Title);
      formData.append('Content', blogData.Content);
      formData.append('ParnerID', getPartnerId());
      formData.append('ThumbnailUrl', blogData.ThumbnailUrl);
      formData.append('BlogStatus', blogData.BlogStatus.toString());

      const response = await api.post<PartnerApiResponse<string>>('/Partner/blog', formData, {
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

  async updateBlog(blogId: string, blogData: Omit<PartnerBlogRequest, 'ParnerID'>): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('Title', blogData.Title);
      formData.append('Content', blogData.Content);
      formData.append('ParnerID', getPartnerId());
      formData.append('ThumbnailUrl', blogData.ThumbnailUrl);
      formData.append('BlogStatus', blogData.BlogStatus.toString());

      const response = await api.put<PartnerApiResponse<string>>(`/Partner/blog/${blogId}`, formData, {
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

  // ========== COURT MANAGEMENT ==========
  async getCourts(params: CourtParams): Promise<PartnerPaginatedResponse<PartnerCourt>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('id', getPartnerId());
      queryParams.append('Page', params.Page.toString());
      queryParams.append('PageSize', params.PageSize.toString());
      if (params.Name) queryParams.append('Name', params.Name);
      if (params.Status !== undefined) queryParams.append('Status', params.Status.toString());

      const response = await api.get<PartnerApiResponse<PartnerPaginatedResponse<PartnerCourt>>>(
        `/Partner/court?${queryParams.toString()}`
      );
      return response.data.Data!;
    } catch (error) {
      console.error('Error fetching courts:', error);
      throw error;
    }
  },

  async getCourtById(courtId: string): Promise<PartnerCourt> {
    try {
      const response = await api.get<PartnerApiResponse<PartnerCourt>>(`/Partner/court/${courtId}`);
      return response.data.Data!;
    } catch (error) {
      console.error('Error fetching court:', error);
      throw error;
    }
  },

  async createCourt(courtData: Omit<PartnerCourtRequest, 'PartnerId'>): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('PartnerId', getPartnerId());
      formData.append('Name', courtData.Name);
      formData.append('Location', courtData.Location);
      formData.append('PricePerHour', courtData.PricePerHour.toString());
      formData.append('ImageUrl', courtData.ImageUrl);
      formData.append('CourtStatus', courtData.CourtStatus.toString());
      courtData.TimeSlotIDs.forEach(id => formData.append('TimeSlotIDs', id));

      const response = await api.post<PartnerApiResponse<string>>('/Partner/court', formData, {
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

  async updateCourt(courtId: string, courtData: Omit<PartnerCourtRequest, 'PartnerId'>): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('PartnerId', getPartnerId());
      formData.append('Name', courtData.Name);
      formData.append('Location', courtData.Location);
      formData.append('PricePerHour', courtData.PricePerHour.toString());
      formData.append('ImageUrl', courtData.ImageUrl);
      formData.append('CourtStatus', courtData.CourtStatus.toString());
      courtData.TimeSlotIDs.forEach(id => formData.append('TimeSlotIDs', id));

      const response = await api.put<PartnerApiResponse<string>>(`/Partner/court/${courtId}`, formData, {
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
      const response = await api.delete<PartnerApiResponse<string>>(`/Partner/court/${courtId}`);
      return response.data.Message;
    } catch (error) {
      console.error('Error deleting court:', error);
      throw error;
    }
  },

  // ========== TIMESLOT MANAGEMENT ==========
  async getTimeSlots(): Promise<PartnerTimeSlot[]> {
    try {
      const response = await api.get<PartnerApiResponse<PartnerTimeSlot[]>>(
        `/Partner/timeslot?id=${getPartnerId()}`
      );
      return response.data.Data!;
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw error;
    }
  },

  async createTimeSlot(timeSlotData: Omit<PartnerTimeSlotRequest, 'PartnerId'>): Promise<string> {
    try {
      const requestData = {
        PartnerId: getPartnerId(),
        StartTime: timeSlotData.StartTime,
        EndTime: timeSlotData.EndTime
      };

      const response = await api.post<PartnerApiResponse<string>>('/Partner/timeslot', requestData);
      return response.data.Message;
    } catch (error) {
      console.error('Error creating time slot:', error);
      throw error;
    }
  },

  async deleteTimeSlot(timeSlotId: string): Promise<string> {
    try {
      const response = await api.delete<PartnerApiResponse<string>>(`/Partner/timeslot/${timeSlotId}`);
      return response.data.Message;
    } catch (error) {
      console.error('Error deleting time slot:', error);
      throw error;
    }
  },

  // ========== BOOKING MANAGEMENT ==========
  async getBookings(params: BookingParams): Promise<PartnerPaginatedResponse<PartnerBooking>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('Page', params.Page.toString());
      queryParams.append('PageSize', params.PageSize.toString());
      if (params.Customer) queryParams.append('Customer', params.Customer);
      if (params.BookingStatus !== undefined) queryParams.append('BookingStatus', params.BookingStatus.toString());

      const response = await api.get<PartnerApiResponse<PartnerPaginatedResponse<PartnerBooking>>>(
        `/Partner/booking/${getPartnerId()}?${queryParams.toString()}`
      );
      return response.data.Data!;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }
};
