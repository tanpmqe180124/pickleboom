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
  partnerId: string;
  partnerName: string;
  createdAt: string;
  updatedAt: string;
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
  isAvailable: boolean;
  courtId: string;
  courtName: string;
}

export interface PartnerTimeSlotRequest {
  StartTime: string;
  EndTime: string;
  CourtId: string;
}

export interface PartnerBlog {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  authorName?: string;
  isPublished?: boolean;
}

export interface PartnerBlogRequest {
  Title: string;
  Content: string;
  UserID?: string;
  Image?: File;
}

export interface PartnerBooking {
  id: string;
  userId: string;
  userName: string;
  courtId: string;
  courtName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: number; // 0: Pending, 1: Confirmed, 2: Cancelled, 3: Completed
  createdAt: string;
  notes?: string;
}

export interface PartnerCourtParams {
  Page?: number;
  PageSize?: number;
  Name?: string;
  CourtStatus?: number;
  Location?: string;
}

export interface PartnerBookingParams {
  Page?: number;
  PageSize?: number;
  Status?: number;
  StartDate?: string;
  EndDate?: string;
}

// ========== PARTNER SERVICE ==========
export const partnerService = {
  // ========== COURT SERVICES ==========
  // Get all courts for partner
  getCourts: async (params?: PartnerCourtParams): Promise<PartnerCourt[]> => {
    try {
      // Note: Backend expects partner ID as query param
      const response = await api.get('/api/Partner/court', { params });
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching partner courts:', error);
      throw error;
    }
  },

  // Get court by ID
  getCourtById: async (id: string): Promise<PartnerCourt> => {
    try {
      const response = await api.get(`/api/Partner/court/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching court by ID:', error);
      throw error;
    }
  },

  // Create new court
  createCourt: async (data: PartnerCourtRequest): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('Name', data.Name);
      formData.append('Description', data.Description);
      formData.append('Location', data.Location);
      formData.append('PricePerHour', data.PricePerHour.toString());
      formData.append('CourtStatus', data.CourtStatus.toString());
      formData.append('TimeSlotIDs', JSON.stringify(data.TimeSlotIDs));
      
      if (data.ImageUrl) {
        formData.append('ImageUrl', data.ImageUrl);
      }

      const response = await api.post('/api/Partner/court', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.message || 'Court created successfully';
    } catch (error) {
      console.error('Error creating court:', error);
      throw error;
    }
  },

  // Update court
  updateCourt: async (id: string, data: PartnerCourtRequest): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('Name', data.Name);
      formData.append('Description', data.Description);
      formData.append('Location', data.Location);
      formData.append('PricePerHour', data.PricePerHour.toString());
      formData.append('CourtStatus', data.CourtStatus.toString());
      formData.append('TimeSlotIDs', JSON.stringify(data.TimeSlotIDs));
      
      if (data.ImageUrl) {
        formData.append('ImageUrl', data.ImageUrl);
      }

      const response = await api.put(`/api/Partner/court/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.message || 'Court updated successfully';
    } catch (error) {
      console.error('Error updating court:', error);
      throw error;
    }
  },

  // Delete court
  deleteCourt: async (id: string): Promise<string> => {
    try {
      const response = await api.delete(`/api/Partner/court/${id}`);
      return response.data.message || 'Court deleted successfully';
    } catch (error) {
      console.error('Error deleting court:', error);
      throw error;
    }
  },

  // ========== TIME SLOT SERVICES ==========
  // Get time slots for partner's courts
  getTimeSlots: async (courtId?: string): Promise<PartnerTimeSlot[]> => {
    try {
      const params = courtId ? { courtId } : {};
      const response = await api.get('/api/Partner/timeslot', { params });
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching partner time slots:', error);
      throw error;
    }
  },

  // Create time slot
  createTimeSlot: async (data: PartnerTimeSlotRequest): Promise<string> => {
    try {
      const response = await api.post('/api/Partner/timeslot', data);
      return response.data.message || 'Time slot created successfully';
    } catch (error) {
      console.error('Error creating time slot:', error);
      throw error;
    }
  },

  // Delete time slot
  deleteTimeSlot: async (id: string): Promise<string> => {
    try {
      const response = await api.delete(`/api/Partner/timeslot/${id}`);
      return response.data.message || 'Time slot deleted successfully';
    } catch (error) {
      console.error('Error deleting time slot:', error);
      throw error;
    }
  },

  // ========== BLOG SERVICES ==========
  // Get blogs for partner
  getBlogs: async (params?: any): Promise<PartnerBlog[]> => {
    try {
      const response = await api.get('/api/Partner/blog', { params });
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching partner blogs:', error);
      throw error;
    }
  },

  // Get blog by ID
  getBlogById: async (id: string): Promise<PartnerBlog> => {
    try {
      const response = await api.get(`/api/Partner/blog/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching blog by ID:', error);
      throw error;
    }
  },

  // Create blog
  createBlog: async (data: PartnerBlogRequest): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('Title', data.Title);
      formData.append('Content', data.Content);
      formData.append('UserID', data.UserID || '');
      
      if (data.Image) {
        formData.append('Image', data.Image);
      }

      const response = await api.post('/api/Partner/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.message || 'Blog created successfully';
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  // Update blog
  updateBlog: async (id: string, data: PartnerBlogRequest): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('Title', data.Title);
      formData.append('Content', data.Content);
      formData.append('UserID', data.UserID || '');
      
      if (data.Image) {
        formData.append('Image', data.Image);
      }

      const response = await api.put(`/api/Partner/blog/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.message || 'Blog updated successfully';
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  // Delete blog
  deleteBlog: async (id: string): Promise<string> => {
    try {
      const response = await api.delete(`/api/Partner/blog/${id}`);
      return response.data.message || 'Blog deleted successfully';
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  },

  // ========== BOOKING SERVICES ==========
  // Get bookings for partner's courts
  getBookings: async (partnerId: string, params?: PartnerBookingParams): Promise<PartnerBooking[]> => {
    try {
      const response = await api.get(`/api/Partner/booking/${partnerId}`, { params });
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching partner bookings:', error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (id: string, status: number): Promise<string> => {
    try {
      const response = await api.put(`/api/Partner/booking/${id}/status`, { status });
      return response.data.message || 'Booking status updated successfully';
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // ========== DASHBOARD SERVICES ==========
  // Get partner dashboard stats
  getDashboardStats: async (): Promise<any> => {
    try {
      const response = await api.get('/api/Partner/dashboard/stats');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get partner profile
  getProfile: async (): Promise<any> => {
    try {
      const response = await api.get('/api/Partner/profile');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching partner profile:', error);
      throw error;
    }
  },

  // Update partner profile
  updateProfile: async (data: any): Promise<string> => {
    try {
      const response = await api.put('/api/Partner/profile', data);
      return response.data.message || 'Profile updated successfully';
    } catch (error) {
      console.error('Error updating partner profile:', error);
      throw error;
    }
  }
};