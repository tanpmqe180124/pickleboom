import { api } from '@/infrastructure/api/axiosClient';

// ========== TYPES ==========
export interface AdminUser {
  ID: string;
  FullName: string;
  UserName: string;
  Email: string;
  PhoneNumber: string;
  Avatar: string;
  Status: number; // 0: Active, 1: Inactive
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
      const response = await api.get<ApiResponse<PaginatedResponse<AdminUser>>>('/User', { params });
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

  // ========== COURT MANAGEMENT ==========
  async getCourts(params?: { Name?: string; CourtStatus?: number }): Promise<AdminCourt[]> {
    try {
      // Add pagination parameters and map CourtStatus to Status for backend
      const requestParams = {
        Page: 1,
        PageSize: 100,
        Name: params?.Name,
        Status: params?.CourtStatus  // Map CourtStatus to Status for backend
      };
      console.log('getCourts requestParams being sent:', requestParams);
      const response = await api.get<ApiResponse<AdminCourt[]>>('/Court', { params: requestParams });
      console.log('getCourts raw response:', response);
      console.log('response.data:', response.data);
      
      // Handle different response structures
      if (response.data && (response.data as any).data && (response.data as any).data.data && Array.isArray((response.data as any).data.data)) {
        return (response.data as any).data.data;
      } else if (response.data && (response.data as any).data && Array.isArray((response.data as any).data)) {
        return (response.data as any).data;
      } else if (Array.isArray(response.data)) {
        return response.data;
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

      const response = await api.post<ApiResponse<string>>('/Court', formData, {
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

  async updateCourt(courtId: string, courtData: AdminCourtRequest): Promise<string> {
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

      const response = await api.put<ApiResponse<string>>(`/Court/${courtId}`, formData, {
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
      const response = await api.delete<ApiResponse<string>>(`/Court/${courtId}`);
      return response.data.Message;
    } catch (error) {
      console.error('Error deleting court:', error);
      throw error;
    }
  },

  // ========== TIMESLOT MANAGEMENT ==========
  async getTimeSlots(): Promise<AdminTimeSlot[]> {
    try {
      const response = await api.get<ApiResponse<AdminTimeSlot[]>>('/Admin/timeslot');
      console.log('getTimeSlots raw response:', response);
      console.log('response.data:', response.data);
      
      // Handle different response structures
      if (response.data && (response.data as any).data && (response.data as any).data.data && Array.isArray((response.data as any).data.data)) {
        return (response.data as any).data.data;
      } else if (response.data && (response.data as any).data && Array.isArray((response.data as any).data)) {
        return (response.data as any).data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Unexpected API response structure for time slots:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw error;
    }
  },

  async createTimeSlot(timeSlotData: AdminTimeSlotRequest): Promise<string> {
    try {
      const response = await api.post<ApiResponse<string>>('/Admin/timeslot', timeSlotData);
      return response.data.Message;
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
      const response = await api.delete<ApiResponse<string>>(`/Admin/timeslot/${timeSlotId}`);
      return response.data.Message;
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

      const response = await api.post<ApiResponse<string>>('/Admin/blog', formData, {
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

      const response = await api.put<ApiResponse<string>>(`/Admin/blog/${blogId}`, formData, {
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
      const response = await api.get<ApiResponse<PaginatedResponse<AdminBooking>>>('/Admin/booking', { params });
      return response.data.Data;
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
