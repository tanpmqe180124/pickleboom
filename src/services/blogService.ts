import { api } from '@/infrastructure/api/axiosClient';

// ========== INTERFACES ==========
export interface PublicBlog {
  id: string;
  title: string;
  content: string;
  thumbnailUrl?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogParams {
  Page?: number;
  PageSize?: number;
  Title?: string;
  Status?: number;
}

export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}

export interface PaginatedResponse<T> {
  page: number;
  pageSize: number;
  total: number;
  data: T[];
}

// ========== BLOG SERVICE ==========
export const blogService = {
  // Lấy danh sách blog public
  getBlogs: async (params?: BlogParams): Promise<PublicBlog[]> => {
    try {
      const defaultParams = {
        Page: 1,
        PageSize: 12,
        ...params
      };
      
      const response = await api.get<ApiResponse<PaginatedResponse<PublicBlog>>>('/Common/blog', { 
        params: defaultParams 
      });
      
      const responseData = response.data?.data;
      if (responseData && responseData.data) {
        return responseData.data;
      }
      
      return response.data?.data?.data || response.data?.data || [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  // Lấy blog theo ID
  getBlogById: async (id: string): Promise<PublicBlog> => {
    try {
      const response = await api.get<ApiResponse<PublicBlog>>(`/Common/blog/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching blog by ID:', error);
      throw error;
    }
  },

  // Lấy blog mới nhất
  getLatestBlogs: async (limit: number = 3): Promise<PublicBlog[]> => {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<PublicBlog>>>('/Common/blog', {
        params: {
          Page: 1,
          PageSize: limit,
          Status: 1 // Chỉ lấy blog đã publish
        }
      });
      
      const responseData = response.data?.data;
      if (responseData && responseData.data) {
        return responseData.data;
      }
      
      return response.data?.data?.data || response.data?.data || [];
    } catch (error) {
      console.error('Error fetching latest blogs:', error);
      throw error;
    }
  }
};
