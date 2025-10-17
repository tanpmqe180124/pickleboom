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
  CourtId?: string; // Frontend có thể cần CourtId nhưng backend không cần
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
  customer: string;
  phone: string;
  court: string;
  bookingDate: string;
  paymentStatus: number;
  bookingStatus: number; // 0: Pending, 1: Confirmed, 2: Cancelled, 3: Completed
  totalAmount: number;
  createdAt: string;
  bookingTimeSlots: {
    id: string;
    startTime: string;
    endTime: string;
  }[];
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
      // Backend expects partner ID as query param `id`
      const partnerId = localStorage.getItem('userID');
      const query = {
        Page: 1,
        PageSize: 50,
        ...(params || {}),
        id: partnerId,
      } as any;
      const response = await api.get('/Partner/court', { params: query });
      const payload = response.data?.data ?? response.data;
      // Controller wraps DataReponse { page, pageSize, total, data }
      return Array.isArray(payload) ? payload : (payload?.data ?? []);
    } catch (error) {
      console.error('Error fetching partner courts:', error);
      throw error;
    }
  },

  // Get court by ID
  getCourtById: async (id: string): Promise<PartnerCourt> => {
    try {
      const response = await api.get(`/Partner/court/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching court by ID:', error);
      throw error;
    }
  },

  // Create new court
  createCourt: async (data: PartnerCourtRequest): Promise<string> => {
    try {
      // Lấy PartnerId từ localStorage
      const partnerId = localStorage.getItem('userID');
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }

      const formData = new FormData();
      formData.append('PartnerId', partnerId);
      formData.append('Name', data.Name);
      formData.append('Location', data.Location);
      formData.append('PricePerHour', data.PricePerHour.toString());
      formData.append('CourtStatus', data.CourtStatus.toString());
      // Append time slots in a way ASP.NET model binder expects: TimeSlotIDs=guid&TimeSlotIDs=guid
      if (Array.isArray(data.TimeSlotIDs)) {
        data.TimeSlotIDs.forEach((id) => {
          if (id) formData.append('TimeSlotIDs', id);
        });
      }
      
      if (data.ImageUrl && data.ImageUrl instanceof File) {
        formData.append('ImageUrl', data.ImageUrl);
        console.log('🏟️ Image file appended:', data.ImageUrl.name, data.ImageUrl.size, 'bytes');
      } else {
        console.warn('🏟️ No valid image file provided');
      }

      console.log('🏟️ Creating court with data:', {
        PartnerId: partnerId,
        Name: data.Name,
        Location: data.Location,
        PricePerHour: data.PricePerHour,
        CourtStatus: data.CourtStatus,
        TimeSlotIDs: data.TimeSlotIDs,
        ImageUrl: data.ImageUrl ? 'File provided' : 'No file'
      });

      // Let axios set the correct multipart boundary automatically
      const response = await api.post('/Partner/court', formData);
      
      return response.data.message || 'Court created successfully';
    } catch (error) {
      console.error('Error creating court:', error);
      throw error;
    }
  },

  // Update court
  updateCourt: async (id: string, data: PartnerCourtRequest): Promise<string> => {
    try {
      // Lấy PartnerId từ localStorage
      const partnerId = localStorage.getItem('userID');
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }

      const formData = new FormData();
      formData.append('PartnerId', partnerId);
      formData.append('Name', data.Name);
      formData.append('Location', data.Location);
      formData.append('PricePerHour', data.PricePerHour.toString());
      formData.append('CourtStatus', data.CourtStatus.toString());
      if (Array.isArray(data.TimeSlotIDs)) {
        data.TimeSlotIDs.forEach((id) => {
          if (id) formData.append('TimeSlotIDs', id);
        });
      }
      
      if (data.ImageUrl && data.ImageUrl instanceof File) {
        formData.append('ImageUrl', data.ImageUrl);
        console.log('🏟️ Image file appended for update:', data.ImageUrl.name, data.ImageUrl.size, 'bytes');
      } else {
        console.warn('🏟️ No valid image file provided for update');
      }

      console.log('🏟️ Updating court with data:', {
        PartnerId: partnerId,
        Name: data.Name,
        Location: data.Location,
        PricePerHour: data.PricePerHour,
        CourtStatus: data.CourtStatus,
        TimeSlotIDs: data.TimeSlotIDs,
        ImageUrl: data.ImageUrl ? 'File provided' : 'No file'
      });

      const response = await api.put(`/Partner/court/${id}`, formData);
      
      return response.data.message || 'Court updated successfully';
    } catch (error) {
      console.error('Error updating court:', error);
      throw error;
    }
  },

  // Delete court
  deleteCourt: async (id: string): Promise<string> => {
    try {
      const response = await api.delete(`/Partner/court/${id}`);
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
      // Backend cần partner ID, lấy từ localStorage hoặc context
      const partnerId = localStorage.getItem('userID');
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }
      
      // Backend có [HttpGet("timeslot")] với Guid id parameter
      // Vì không có {id} trong route, backend sẽ tìm id trong query parameters
      // axios baseURL already includes /api
      const response = await api.get(`/Partner/timeslot?id=${partnerId}`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching partner time slots:', error);
      throw error;
    }
  },

  // Create time slot
  createTimeSlot: async (data: PartnerTimeSlotRequest): Promise<string> => {
    try {
      const partnerId = localStorage.getItem('userID');
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }
      
      // Chuẩn hóa thời gian về định dạng HH:mm:ss để backend (TimeOnly) parse được
      const toBackendTime = (timeStr: string): string => {
        if (!timeStr) return timeStr;
        const value = timeStr.trim();
        // Nếu có AM/PM → parse sang 24h
        if (/(am|pm)$/i.test(value) || /(am|pm)/i.test(value)) {
          const date = new Date(`1970-01-01 ${value}`);
          if (!isNaN(date.getTime())) {
            const hh = String(date.getHours()).padStart(2, '0');
            const mm = String(date.getMinutes()).padStart(2, '0');
            const ss = String(date.getSeconds()).padStart(2, '0');
            return `${hh}:${mm}:${ss}`;
          }
        }
        // Nếu là HH:mm → thêm :00
        if (/^\d{1,2}:\d{2}$/.test(value)) {
          const [h, m] = value.split(':');
          const hh = String(Number(h)).padStart(2, '0');
          return `${hh}:${m}:00`;
        }
        // Nếu đã là HH:mm:ss thì giữ nguyên
        if (/^\d{2}:\d{2}:\d{2}$/.test(value)) {
          return value;
        }
        return value;
      };

      // Backend expect TimeSlotRequest với PartnerId, StartTime, EndTime
      const requestData = {
        PartnerId: partnerId,
        StartTime: toBackendTime(data.StartTime),
        EndTime: toBackendTime(data.EndTime)
      };
      
      const response = await api.post('/Partner/timeslot', requestData);
      return response.data.message || 'Time slot created successfully';
    } catch (error) {
      console.error('Error creating time slot:', error);
      throw error;
    }
  },

  // Delete time slot
  deleteTimeSlot: async (id: string): Promise<string> => {
    try {
      const response = await api.delete(`/Partner/timeslot/${id}`);
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
      const response = await api.get('/Common/blog', { params });
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching partner blogs:', error);
      throw error;
    }
  },

  // Get blog by ID
  getBlogById: async (id: string): Promise<PartnerBlog> => {
    try {
       const response = await api.get(`/Common/blog/${id}`);
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
      
      // Fix: Get partner ID from localStorage instead of data.UserID
      const partnerId = localStorage.getItem('userID');
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }
      formData.append('ParnerID', partnerId);
      formData.append('BlogStatus', '1');
      
      if (data.Image) {
        formData.append('ThumbnailUrl', data.Image);
      }

      const response = await api.post('/Partner/blog', formData, {
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
      
      // Fix: Get partner ID from localStorage instead of data.UserID
      const partnerId = localStorage.getItem('userID');
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }
      formData.append('ParnerID', partnerId);
      formData.append('BlogStatus', '1');
      
      if (data.Image) {
        formData.append('ThumbnailUrl', data.Image);
      }

      const response = await api.put(`/Partner/blog/${id}`, formData, {
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
      const response = await api.delete(`/Partner/blog/${id}`);
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
      console.log('Fetching bookings for partner:', partnerId);
      const response = await api.get(`/Partner/booking-by-partner/${partnerId}`, { params });
      console.log('Bookings API Response:', response.data);
      
      // Handle nested data structure: response.data.data.data
      const bookingsData = response.data?.data?.data || response.data?.data || response.data || [];
      console.log('Parsed bookings data:', bookingsData);
      
      return Array.isArray(bookingsData) ? bookingsData : [];
    } catch (error) {
      console.error('Error fetching partner bookings:', error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (id: string, status: number): Promise<string> => {
    try {
      const response = await api.put(`/Partner/booking/${id}/status`, { status });
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
      const response = await api.get('/Partner/dashboard/stats');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get partner profile
  getProfile: async (): Promise<any> => {
    try {
      const response = await api.get('/Partner/profile');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching partner profile:', error);
      throw error;
    }
  },

  // Update partner profile
  updateProfile: async (data: any): Promise<string> => {
    try {
      const response = await api.put('/Partner/profile', data);
      return response.data.message || 'Profile updated successfully';
    } catch (error) {
      console.error('Error updating partner profile:', error);
      throw error;
    }
  }
};