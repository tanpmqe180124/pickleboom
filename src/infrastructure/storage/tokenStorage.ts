import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { api } from '../api/axiosClient';
import axios from 'axios';

// ========== Kiểu dữ liệu ==========
interface UserObject {
  userId?: string;
  role?: string;
  fullName?: string;
  avatar?: string;
  verified?: boolean;
}

interface LoginCredential {
  [key: string]: any;
}

interface AuthState {
  user: UserObject | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credential: LoginCredential) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserObject | null) => void;
  refreshTokenAsync: () => Promise<boolean>;
}

// ========== Hàm tiện ích ==========
export const createUserObject = (data: any): UserObject => {
  console.log('createUserObject - Full data received:', data);
  console.log('createUserObject - data.userId:', data?.userId);
  console.log('createUserObject - data.AccessToken:', data?.AccessToken);
  console.log('createUserObject - data.accessToken:', data?.accessToken);
  
  // Lấy userId từ JWT token nếu có
  let userId = data?.userId;
  const token = data?.AccessToken || data?.accessToken;
  
  let role = null;
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT payload:', payload);
      console.log('JWT payload keys:', Object.keys(payload));
      
      // Thử các key có thể có cho userId (chỉ nếu chưa có userId)
      if (!userId) {
        userId = payload.nameid || 
                 payload[`${payload.iss}/nameidentifier`] ||
                 payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
                 payload.sub ||
                 payload.userId ||
                 payload.id ||
                 payload.user_id;
        console.log('Extracted userId from token:', userId, 'Payload keys:', Object.keys(payload));
      }
      
      // Lấy role từ JWT token
      role = payload.role || 
             payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
             payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];
      console.log('Extracted role from token:', role);
      console.log('JWT payload role key:', payload.role);
      console.log('JWT payload claims role key:', payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
    } catch (error) {
      console.error('Error extracting userId and role from token:', error);
    }
  }
  
  console.log('createUserObject - Raw data:', data);
  console.log('createUserObject - data.data:', data?.data);
  console.log('createUserObject - data.data.role:', data?.data?.role);
  console.log('createUserObject - data.Data:', data?.Data);
  console.log('createUserObject - data.Data.Role:', data?.Data?.Role);
  console.log('createUserObject - role from JWT:', role);
  
  const userObject = {
    userId: userId,
    role: role || data?.data?.role || data?.Data?.Role || data?.data?.Role, // Ưu tiên role từ JWT token, giữ nguyên case
    fullName: data?.Data?.FullName || data?.data?.FullName || data?.data?.fullName,
    verified: data?.Data?.IsApproved || data?.data?.IsApproved || data?.data?.isApproved,
  };
  
  // Lưu role và userId vào localStorage để AuthContext có thể sử dụng
  if (userObject.role) {
    localStorage.setItem('userRole', userObject.role);
    console.log('createUserObject - Saved role to localStorage:', userObject.role);
    
    // Dispatch custom event để thông báo cho AuthContext
    window.dispatchEvent(new CustomEvent('userRoleUpdated', { 
      detail: { userRole: userObject.role } 
    }));
  }
  
  if (userObject.userId) {
    localStorage.setItem('userID', userObject.userId);
    console.log('createUserObject - Saved userId to localStorage:', userObject.userId);
  } else {
    console.log('createUserObject - No userId found in data');
  }
  
  console.log('createUserObject - Final user object:', userObject);
  return userObject;
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userID');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userRole');
  delete api.defaults.headers.common['Authorization'];
  // Xóa cookie refresh_token nếu có
  document.cookie = 'refresh_token=; Max-Age=0; path=/;';
};

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

type AuthStoreCreator = StateCreator<AuthState, [], [], AuthState>;

const authStore: AuthStoreCreator = (set, get) => ({
  ...initialState,

  login: async (credential: LoginCredential) => {
    set({ isLoading: true, error: null });

    try {
      clearAuthToken();
      
      console.log('Attempting login with credentials:', { email: credential.Email });
      
      // Thêm timeout cho login request
      const loginPromise = api.post('Account/login', credential);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout')), 30000)
      );
      
      const { data } = await Promise.race([loginPromise, timeoutPromise]) as any;
      
      console.log('Login response received:', data);
      console.log('data.accessToken:', data?.accessToken);
      console.log('data.Data:', data?.Data);
      console.log('data.Data.Role:', data?.Data?.Role);
      console.log('data.data:', data?.data);
      console.log('data.data.role:', data?.data?.role);
      console.log('data.data.Role:', data?.data?.Role);

      // Nhận accessToken từ backend (accessToken nằm trực tiếp trong data)
      const accessToken = data?.accessToken || data?.data?.accessToken || data?.data?.AccessToken || data?.AccessToken || data?.token || data?.access_token;
      if (!accessToken) {
        console.error('No access token in response:', data);
        throw new Error('Invalid login response - no access token');
      }

      setAuthToken(accessToken);
      console.log('Token saved to localStorage:', localStorage.getItem('token'));
      
      // Dispatch event để cập nhật AuthContext
      window.dispatchEvent(new CustomEvent('storage'));
      
      // Truyền cả data và accessToken vào createUserObject
      const userObject = createUserObject({...data, accessToken});
      console.log('Created user object:', userObject);

      set({
        user: userObject,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
      
      console.log('Zustand state after set:', get());
      console.log('Login successful, user authenticated');
    } catch (error: any) {
      console.error('Login failed:', error);
      
      clearAuthToken();
      
      let errorMessage = 'Login failed';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Vui lòng thử lại.';
      } else if (!error?.response) {
        errorMessage = 'Network Error. Vui lòng kiểm tra kết nối mạng.';
      }

      set({
        ...initialState,
        error: errorMessage,
        isLoading: false,
      });

      console.error('Login error details:', {
        status: error?.response?.status,
        message: errorMessage,
        data: error?.response?.data,
        code: error?.code,
      });

      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      // Gọi API logout để xóa refresh token khỏi database
      await api.get('Account/logout');
    } catch (error) {
      console.error('Logout API error:', error);
      // Vẫn tiếp tục logout local dù API có lỗi
    }
    
    clearAuthToken();
    set({ ...initialState, isLoading: false });
  },
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  refreshTokenAsync: async () => {
    try {
      console.log('🔄 refreshTokenAsync called');
      
      // Backend sử dụng cookie-based refresh token
      // Refresh token được lưu trong HttpOnly cookie tự động
      
      console.log('📡 Calling refresh token API...');
      console.log('🍪 Document cookies:', document.cookie);
      
      // Tạo một axios instance riêng để tránh infinite loop
      const refreshApi = axios.create({
        baseURL: 'https://bookingpickleball.onrender.com/api',
        withCredentials: true,
        timeout: 10000
      });
      
      const response = await refreshApi.get('Account/refresh-token');
      
      console.log('📥 Refresh token response:', response.data);
      
      if (response.data && response.data.Data) {
        const newAccessToken = response.data.Data.accessToken || response.data.Data.AccessToken;
        
        if (newAccessToken) {
          console.log('✅ New access token received');
          
          // Cập nhật token mới
          setAuthToken(newAccessToken);
          
          // Cập nhật state
          set(prev => ({
            ...prev,
            token: newAccessToken,
            isAuthenticated: true
          }));
          
          console.log('✅ Token refreshed successfully');
          return true;
        }
      }
      
      console.error('❌ Invalid refresh token response:', response.data);
      return false;
    } catch (error: any) {
      console.error('❌ Refresh token failed:', error);
      
      // Log chi tiết lỗi
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        // Nếu 401, có nghĩa là refresh token hết hạn hoặc không hợp lệ
        if (error.response.status === 401) {
          console.log('🚨 Refresh token expired or invalid - need to login again');
          console.log('🍪 Current cookies:', document.cookie);
          
          // KHÔNG clear auth ở đây - để axios interceptor handle
          console.log('🔄 Let axios interceptor handle the 401 error');
          return false;
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      
      return false;
    }
  },
});

export const useAuthStore = create<AuthState>()(
  persist(authStore, {
    name: 'authStore',
  } as PersistOptions<AuthState>),
);
