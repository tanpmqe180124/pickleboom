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
    console.log('=== DEBUGGING PARTNER ID ===');
    
    // Debug: Show all localStorage keys
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('All localStorage values:', {
      userID: localStorage.getItem('userID'),
      userRole: localStorage.getItem('userRole'),
      token: localStorage.getItem('token') ? 'EXISTS' : 'NOT FOUND'
    });
    
    // First try to get from localStorage (AuthContext stores it there)
    const userID = localStorage.getItem('userID');
    console.log('userID from localStorage:', userID);
    
    if (userID && userID !== '00000000-0000-0000-0000-000000000000') {
      console.log('✅ Using userID from localStorage:', userID);
      return userID;
    }

    // Fallback: try to extract from JWT token
    const token = localStorage.getItem('token');
    console.log('token from localStorage:', token ? 'EXISTS' : 'NOT FOUND');
    
    if (!token) {
      console.error('❌ No token found in localStorage');
      return '';
    }
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('JWT payload:', payload);
    
    // Try different possible claim names
    const partnerId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
                     payload.nameid || 
                     payload.sub ||
                     payload.userId ||
                     payload.id;
    
    console.log('Extracted PartnerId from JWT:', partnerId);
    
    if (!partnerId || partnerId === '00000000-0000-0000-0000-000000000000') {
      console.error('❌ Invalid PartnerId:', partnerId);
      return '';
    }
    
    console.log('✅ Using PartnerId from JWT:', partnerId);
    return partnerId;
  } catch (error) {
    console.error('❌ Error getting PartnerId:', error);
    return '';
  }
};

// ========== PARTNER SERVICE ==========
export const partnerService = {
  // ========== BLOG MANAGEMENT ==========
  async createBlog(blogData: Omit<PartnerBlogRequest, 'ParnerID'>): Promise<string> {
    try {
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Không thể lấy PartnerId. Vui lòng đăng nhập lại.');
      }

      const formData = new FormData();
      formData.append('Title', blogData.Title);
      formData.append('Content', blogData.Content);
      formData.append('ParnerID', partnerId);
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
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Không thể lấy PartnerId. Vui lòng đăng nhập lại.');
      }

      const formData = new FormData();
      formData.append('Title', blogData.Title);
      formData.append('Content', blogData.Content);
      formData.append('ParnerID', partnerId);
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
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Không thể lấy PartnerId. Vui lòng đăng nhập lại.');
      }

      const queryParams = new URLSearchParams();
      queryParams.append('id', partnerId);
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
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Không thể lấy PartnerId. Vui lòng đăng nhập lại.');
      }

      const formData = new FormData();
      formData.append('PartnerId', partnerId);
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
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Không thể lấy PartnerId. Vui lòng đăng nhập lại.');
      }

      const formData = new FormData();
      formData.append('PartnerId', partnerId);
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
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Không thể lấy PartnerId. Vui lòng đăng nhập lại.');
      }

      const response = await api.get<PartnerApiResponse<PartnerTimeSlot[]>>(
        `/Partner/timeslot?id=${partnerId}`
      );
      return response.data.Data!;
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw error;
    }
  },

  async createTimeSlot(timeSlotData: Omit<PartnerTimeSlotRequest, 'PartnerId'>): Promise<string> {
    try {
      let partnerId = getPartnerId();
      
      // If still empty, try to get from AuthContext directly
      if (!partnerId) {
        console.log('Trying to get PartnerId from AuthContext...');
        try {
          // Try to access AuthContext directly
          const authData = JSON.parse(localStorage.getItem('authData') || '{}');
          partnerId = authData.userID || authData.id;
          console.log('PartnerId from authData:', partnerId);
        } catch (e) {
          console.error('Error getting from authData:', e);
        }
      }
      
      if (!partnerId || partnerId === '00000000-0000-0000-0000-000000000000') {
        throw new Error('Không thể lấy PartnerId. Vui lòng đăng nhập lại.');
      }

      // Backend expects FormData since no [FromBody] attribute
      const formData = new FormData();
      formData.append('PartnerId', partnerId);
      formData.append('StartTime', timeSlotData.StartTime);
      formData.append('EndTime', timeSlotData.EndTime);

      console.log('Creating time slot with FormData:');
      console.log('PartnerId:', partnerId);
      console.log('StartTime:', timeSlotData.StartTime);
      console.log('EndTime:', timeSlotData.EndTime);
      
      const response = await api.post<PartnerApiResponse<string>>('/Partner/timeslot', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Không thể lấy PartnerId. Vui lòng đăng nhập lại.');
      }

      const queryParams = new URLSearchParams();
      queryParams.append('Page', params.Page.toString());
      queryParams.append('PageSize', params.PageSize.toString());
      if (params.Customer) queryParams.append('Customer', params.Customer);
      if (params.BookingStatus !== undefined) queryParams.append('BookingStatus', params.BookingStatus.toString());

      const response = await api.get<PartnerApiResponse<PartnerPaginatedResponse<PartnerBooking>>>(
        `/Partner/booking/${partnerId}?${queryParams.toString()}`
      );
      return response.data.Data!;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }
};
