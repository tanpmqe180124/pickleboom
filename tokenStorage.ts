import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { api } from '../api/axiosClient';

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
  
  if (!userId && token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT payload:', payload);
      console.log('JWT payload keys:', Object.keys(payload));
      
      // Thử các key có thể có cho userId
      userId = payload.nameid || 
               payload[`${payload.iss}/nameidentifier`] ||
               payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
               payload.sub ||
               payload.userId ||
               payload.id ||
               payload.user_id;
      console.log('Extracted userId from token:', userId, 'Payload keys:', Object.keys(payload));
    } catch (error) {
      console.error('Error extracting userId from token:', error);
    }
  }
  
  const userObject = {
    userId: userId,
    role: data?.data?.Role?.toLowerCase() || data?.Data?.Role?.toLowerCase(), // Backend trả về data.Role hoặc Data.Role
    fullName: data?.data?.FullName || data?.Data?.FullName,
    verified: data?.data?.IsApproved || data?.Data?.IsApproved,
  };
  
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

      // Nhận accessToken từ backend (AccessToken nằm trong data.data)
      const accessToken = data?.data?.AccessToken || data?.AccessToken || data?.accessToken || data?.token || data?.access_token;
      if (!accessToken) {
        console.error('No access token in response:', data);
        throw new Error('Invalid login response - no access token');
      }

      setAuthToken(accessToken);
      // localStorage.setItem('refreshToken', data.refreshToken); // Bỏ qua refreshToken

      const userObject = createUserObject(data);
      console.log('Created user object:', userObject);

      set({
        user: userObject,
        token: accessToken,
        // refreshToken: data.refreshToken, // Bỏ qua refreshToken
        isAuthenticated: true,
        isLoading: false,
      });
      
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
});

export const useAuthStore = create<AuthState>()(
  persist(authStore, {
    name: 'authStore',
  } as PersistOptions<AuthState>),
);
