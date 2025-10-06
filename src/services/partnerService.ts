import { api } from '@/infrastructure/api/axiosClient';

// ========== INTERFACES ==========
export interface PartnerBlogRequest {
  ParnerID: string;
  Title: string;
  Content: string;
  Image?: File;
}

export interface PartnerCourtRequest {
  PartnerId: string;
  Name: string;
  Address: string;
  Description: string;
  Price: number;
  Image?: File;
}

export interface PartnerCourt {
  id: string;
  name: string;
  address: string;
  description: string;
  price: number;
  imageUrl?: string;
  timeSlots?: any[];
}

export interface TimeSlotRequest {
  PartnerId: string;
  StartTime: string;
  EndTime: string;
}

export interface BookingParams {
  PageNumber?: number;
  PageSize?: number;
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
        throw new Error('Partner ID not found');
      }

      const formData = new FormData();
      formData.append('ParnerID', partnerId);
      formData.append('Title', blogData.Title);
      formData.append('Content', blogData.Content);
      if (blogData.Image) {
        formData.append('Image', blogData.Image);
      }

      const response = await api.post('/Partner/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.message;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  async updateBlog(id: string, blogData: Omit<PartnerBlogRequest, 'ParnerID'>): Promise<string> {
    try {
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }

      const formData = new FormData();
      formData.append('ParnerID', partnerId);
      formData.append('Title', blogData.Title);
      formData.append('Content', blogData.Content);
      if (blogData.Image) {
        formData.append('Image', blogData.Image);
      }

      const response = await api.put(`/Partner/blog/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.message;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  // ========== COURT MANAGEMENT ==========
  async getCourts(): Promise<PartnerCourt[]> {
    try {
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }

      const response = await api.get(`/Partner/court?id=${partnerId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching courts:', error);
      throw error;
    }
  },

  async getCourtById(id: string): Promise<PartnerCourt> {
    try {
      const response = await api.get(`/Partner/court/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching court:', error);
      throw error;
    }
  },

  async createCourt(courtData: Omit<PartnerCourtRequest, 'PartnerId'>): Promise<string> {
    try {
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }

      const formData = new FormData();
      formData.append('PartnerId', partnerId);
      formData.append('Name', courtData.Name);
      formData.append('Address', courtData.Address);
      formData.append('Description', courtData.Description);
      formData.append('Price', courtData.Price.toString());
      if (courtData.Image) {
        formData.append('Image', courtData.Image);
      }

      const response = await api.post('/Partner/court', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.message;
    } catch (error) {
      console.error('Error creating court:', error);
      throw error;
    }
  },

  async updateCourt(id: string, courtData: Omit<PartnerCourtRequest, 'PartnerId'>): Promise<string> {
    try {
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }

      const formData = new FormData();
      formData.append('PartnerId', partnerId);
      formData.append('Name', courtData.Name);
      formData.append('Address', courtData.Address);
      formData.append('Description', courtData.Description);
      formData.append('Price', courtData.Price.toString());
      if (courtData.Image) {
        formData.append('Image', courtData.Image);
      }

      const response = await api.put(`/Partner/court/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.message;
    } catch (error) {
      console.error('Error updating court:', error);
      throw error;
    }
  },

  async deleteCourt(id: string): Promise<string> {
    try {
      const response = await api.delete(`/Partner/court/${id}`);
      return response.data.message;
    } catch (error) {
      console.error('Error deleting court:', error);
      throw error;
    }
  },

  // ========== TIME SLOT MANAGEMENT ==========
  async getTimeSlots(): Promise<any[]> {
    try {
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }

      const response = await api.get(`/Partner/timeslot?id=${partnerId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw error;
    }
  },

  async createTimeSlot(timeSlotData: Omit<TimeSlotRequest, 'PartnerId'>): Promise<string> {
    try {
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }

      // Convert time format from "HH:mm AM/PM" to "HH:mm"
      const convertTo24Hour = (timeStr: string): string => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      };

      const formData = new FormData();
      formData.append('PartnerId', partnerId);
      formData.append('StartTime', convertTo24Hour(timeSlotData.StartTime));
      formData.append('EndTime', convertTo24Hour(timeSlotData.EndTime));

      const response = await api.post('/Partner/timeslot', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.message;
    } catch (error) {
      console.error('Error creating time slot:', error);
      throw error;
    }
  },

  async deleteTimeSlot(id: string): Promise<string> {
    try {
      const response = await api.delete(`/Partner/timeslot/${id}`);
      return response.data.message;
    } catch (error) {
      console.error('Error deleting time slot:', error);
      throw error;
    }
  },

  // ========== BOOKING MANAGEMENT ==========
  async getBookings(params?: BookingParams): Promise<any> {
    try {
      const partnerId = getPartnerId();
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }

      const queryParams = new URLSearchParams();
      if (params?.PageNumber) queryParams.append('PageNumber', params.PageNumber.toString());
      if (params?.PageSize) queryParams.append('PageSize', params.PageSize.toString());
      if (params?.Customer) queryParams.append('Customer', params.Customer);
      if (params?.BookingStatus) queryParams.append('BookingStatus', params.BookingStatus.toString());

      const response = await api.get(`/Partner/booking/${partnerId}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },
};

export default partnerService;