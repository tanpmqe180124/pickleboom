import { api } from '@/infrastructure/api/axiosClient';

// ========== TYPES ==========
export interface AdminUser {
  ID: string;
  FullName: string;
  UserName?: string; // Optional vì backend không trả về
  Email: string;
  PhoneNumber: string;
  Address?: string; // Optional vì backend không map
  BussinessName?: string; // Backend có trả về
  Avatar?: string; // Optional vì có thể null
  IsApproved?: boolean; // Backend trả về boolean thay vì Status number
  Status?: number; // Computed từ IsApproved
  Role?: string; // Backend có trả về
}

export interface AdminUserParams {
  Page: number;
  PageSize: number;
  FullName?: string;
  Status?: number;
  PhoneNumber?: string;
  Email?: string;
}

export interface AdminUserUpdateRequest {
  Status: number;
}

export interface RegisterPartnerRequest {
  Email: string;
  FullName: string;
  BussinessName: string;
  Address: string;
  PhoneNumber: string;
  PayOSClientId: string;
  PayOSApiKey: string;
  PayOSCheckSumKey: string;
}

export interface AdminCourt {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerHour: number;
  imageUrl: string;
  courtStatus: number; // 0: Available, 1: UnderMaintenance, 2: Inactive, 3: Full
  timeSlotIDs: string[];
}

export interface AdminCourtRequest {
  Name: string;
  Description: string;
  Location: string;
  PricePerHour: number;
  ImageUrl?: File;
  CourtStatus: number;
  TimeSlotIDs: string[];
}

export interface AdminTimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface AdminTimeSlotRequest {
  StartTime: string;
  EndTime: string;
}

export interface AdminBlog {
  ID: string;
  Title: string;
  Content: string;
  UserID: string;
  ThumbnailUrl: string;
  BlogStatus: number; // 0: Draft, 1: Published, 2: Hidden
  CreatedAt: string;
}

export interface AdminBlogRequest {
  Title: string;
  Content: string;
  UserID: string;
  ThumbnailUrl?: File;
  BlogStatus: number;
}

export interface AdminBooking {
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
  TimeSlots: AdminTimeSlot[];
}

export interface AdminBookingParams {
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

// ========== ADMIN SERVICE ==========
export const adminService = {
  // ========== USER MANAGEMENT ==========
  async getUsers(params: AdminUserParams): Promise<PaginatedResponse<AdminUser>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<AdminUser>>>('/Admin/user', { params });
      return (response.data as any).data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async updateUserStatus(userId: string, userData: AdminUserUpdateRequest): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('Status', userData.Status.toString());

      const response = await api.patch<ApiResponse<string>>(`/User/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.Message;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  async registerPartner(data: RegisterPartnerRequest): Promise<string> {
    try {
      const response = await api.post('/Account/register-partner', data);
      console.log('Register partner response:', response);
      
      // Handle 204 No Content response
      if (response.status === 204) {
        return 'Partner created successfully'; // Return success message for 204
      }
      
      // Handle 200 response with data
      return response.data?.Message || 'Partner created successfully';
    } catch (error) {
      console.error('Error registering partner:', error);
      throw error;
    }
  },

  // ========== PARTNER MANAGEMENT ==========
  async getPartners(params?: { Page?: number; PageSize?: number; FullName?: string; Status?: number }): Promise<any> {
    try {
      const response = await api.get('/Admin/user', { params });
      return response.data; // Trả về trực tiếp response.data vì structure khác
    } catch (error) {
      console.error('Error fetching partners:', error);
      throw error;
    }
  },

  async updatePartnerStatus(partnerId: string, partnerData: AdminUserUpdateRequest): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('Status', partnerData.Status.toString());

      const response = await api.patch<ApiResponse<string>>(`/User/${partnerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.Message;
    } catch (error) {
      console.error('Error updating partner status:', error);
      throw error;
    }
  },

  // ========== COURT MANAGEMENT ==========
  async getCourts(params?: { Name?: string; CourtStatus?: number }): Promise<AdminCourt[]> {
    try {
      // Court endpoint requires id and date parameters
      const requestParams = {
        id: '00000000-0000-0000-0000-000000000000', // Empty GUID for admin
        date: new Date().toISOString().split('T')[0] // Today's date
      };
      console.log('getCourts requestParams being sent:', requestParams);
      const response = await api.get<ApiResponse<AdminCourt[]>>('/Court', { params: requestParams });
      console.log('getCourts raw response:', response);
      console.log('response.data:', response.data);
      
      // Handle response structure
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data && Array.isArray(response.data.Data)) {
          return response.data.Data;
        } else {
          console.warn('Unexpected API response structure for courts:', response.data);
          return [];
        }
    } catch (error) {
      console.error('Error fetching courts:', error);
      throw error;
    }
  },

  async createCourt(courtData: AdminCourtRequest): Promise<string> {
    try {
      // Court create endpoint not implemented yet
      console.warn('Court create endpoint not implemented in backend yet');
      return 'Court create endpoint not implemented yet';
    } catch (error) {
      console.error('Error creating court:', error);
      throw error;
    }
  },

  async updateCourt(courtId: string, courtData: AdminCourtRequest): Promise<string> {
    try {
      // Court update endpoint not implemented yet
      console.warn('Court update endpoint not implemented in backend yet');
      return 'Court update endpoint not implemented yet';
    } catch (error) {
      console.error('Error updating court:', error);
      throw error;
    }
  },

  async deleteCourt(courtId: string): Promise<string> {
    try {
      // Court delete endpoint not implemented yet
      console.warn('Court delete endpoint not implemented in backend yet');
      return 'Court delete endpoint not implemented yet';
    } catch (error) {
      console.error('Error deleting court:', error);
      throw error;
    }
  },

  // ========== TIMESLOT MANAGEMENT ==========
  async getTimeSlots(): Promise<AdminTimeSlot[]> {
    try {
      // TimeSlot endpoint not implemented yet, return empty array
      console.warn('TimeSlot endpoint not implemented in backend yet');
      return [];
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw error;
    }
  },

  async createTimeSlot(timeSlotData: AdminTimeSlotRequest): Promise<string> {
    try {
      // TimeSlot endpoint not implemented yet
      console.warn('TimeSlot create endpoint not implemented in backend yet');
      return 'TimeSlot endpoint not implemented yet';
    } catch (error) {
      console.error('Error creating time slot:', error);
      throw error;
    }
  },

  // Note: Update method not available in backend - only Add and Delete
  // async updateTimeSlot(timeSlotId: string, timeSlotData: AdminTimeSlotRequest): Promise<string> {
  //   try {
  //     const response = await api.put<ApiResponse<string>>(`/TimeSlot/${timeSlotId}`, timeSlotData);
  //     return response.data.Message;
  //   } catch (error) {
  //     console.error('Error updating time slot:', error);
  //     throw error;
  //   }
  // },

  async deleteTimeSlot(timeSlotId: string): Promise<string> {
    try {
      // TimeSlot endpoint not implemented yet
      console.warn('TimeSlot delete endpoint not implemented in backend yet');
      return 'TimeSlot endpoint not implemented yet';
    } catch (error) {
      console.error('Error deleting time slot:', error);
      throw error;
    }
  },

  // ========== BLOG MANAGEMENT ==========
  async createBlog(blogData: AdminBlogRequest): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('Title', blogData.Title);
      formData.append('Content', blogData.Content);
      formData.append('UserID', blogData.UserID);
      formData.append('BlogStatus', blogData.BlogStatus.toString());
      
      if (blogData.ThumbnailUrl) {
        formData.append('ThumbnailUrl', blogData.ThumbnailUrl);
      }

      const response = await api.post<ApiResponse<string>>('/Blog', formData, {
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

  async updateBlog(blogId: string, blogData: AdminBlogRequest): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('Title', blogData.Title);
      formData.append('Content', blogData.Content);
      formData.append('UserID', blogData.UserID);
      formData.append('BlogStatus', blogData.BlogStatus.toString());
      
      if (blogData.ThumbnailUrl) {
        formData.append('ThumbnailUrl', blogData.ThumbnailUrl);
      }

      const response = await api.put<ApiResponse<string>>(`/Blog/${blogId}`, formData, {
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

  async deleteBlog(blogId: string): Promise<string> {
    try {
      const response = await api.patch<ApiResponse<string>>(`/Admin/blog/${blogId}`);
      return response.data.Message;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  },

  // ========== BOOKING MANAGEMENT ==========
  async getBookings(params: AdminBookingParams): Promise<PaginatedResponse<AdminBooking>> {
    try {
      // Booking endpoint only supports GetByOrderCode, not GetAll
      console.warn('Booking getAll endpoint not implemented in backend yet');
      return {
        Items: [],
        TotalCount: 0,
        Page: 1,
        PageSize: 10,
        TotalPages: 0
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // ========== UTILITY FUNCTIONS ==========
  async checkAdminRole(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const payload = JSON.parse(atob(token.split('.')[1]));
      // Backend dùng ClaimTypes.Role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      console.log('JWT payload:', payload);
      console.log('Role from JWT:', role);
      console.log('Available claims:', Object.keys(payload));
      
      return role?.toLowerCase() === 'admin';
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  }
};

export default adminService;
