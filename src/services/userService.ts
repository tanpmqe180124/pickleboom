import { api } from '@/infrastructure/api/axiosClient';

// Types theo đúng backend
export interface UsersDto {
  ID: string;
  FullName: string;
  UserName: string;
  Email: string;
  PhoneNumber: string;
  Avatar: string;
  Status: number;
}

export interface UserRequest {
  FullName: string;
  PhoneNumber: string;
  UserName: string;
}

export interface ChangePasswordRequest {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmPassword: string;
}

export interface ApiResponse<T> {
  Message: string;
  StatusCode: number;
  Data: T;
}

// User Service theo đúng API backend
export const userService = {
  // 1. Lấy thông tin user theo ID
  async getUserById(userId: string): Promise<UsersDto> {
    try {
      console.log('userService.getUserById - userId:', userId);
      console.log('userService.getUserById - API URL:', `/User/${userId}`);
      console.log('userService.getUserById - Full URL:', `https://bookingpickleball.onrender.com/api/User/${userId}`);
      
      const response = await api.get<ApiResponse<UsersDto>>(`/User/${userId}`);
      console.log('userService.getUserById - API response:', response);
      console.log('userService.getUserById - Response data:', response.data);
      console.log('userService.getUserById - Response data.Data:', response.data.Data);
      console.log('userService.getUserById - Response data.data:', response.data.data);
      
      // Check which format the API returns
      const userData = response.data.Data || response.data.data;
      console.log('userService.getUserById - Final userData:', userData);
      
      if (!userData) {
        throw new Error('No user data found in API response');
      }
      
      return userData;
    } catch (error: any) {
      console.error('userService.getUserById - Error details:', {
        error,
        message: error.message,
        response: error.response?.data,
        status: error.status,
        userId
      });
      throw error;
    }
  },

  // 2. Cập nhật thông tin user
  async updateUser(userId: string, userData: UserRequest): Promise<string> {
    try {
      const response = await api.put<ApiResponse<string>>(`/User/${userId}`, userData);
      return response.data.Data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // 3. Upload avatar
  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.put<ApiResponse<string>>(`/User/upload-avatar/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.Message;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  // 4. Đổi mật khẩu
  async changePassword(userId: string, passwordData: ChangePasswordRequest): Promise<string> {
    try {
      const response = await api.post<ApiResponse<string>>(`/Account/change-password?userId=${userId}`, passwordData);
      return response.data.Message;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
};

export default userService;
