import isUnauthorizedError from '@/utils/httpStatus';
import axios from 'axios';
import { clearAuthToken, useAuthStore } from '../storage/tokenStorage';
import { showToast } from '@/utils/toastManager';

export const api = axios.create({
  baseURL: 'https://bookingpickleball.onrender.com/api',
  headers: {
    Accept: 'application/json',
    'cache-control': 'no-cache',
  },
  timeout: 120000, // 2 phút (120 giây)
  withCredentials: true, // Gửi cookie
});

// ===================== REQUEST INTERCEPTOR =====================
api.interceptors.request.use(
  async (config) => {
    if (config.url?.includes('Account/login')) {
      delete config.headers.Authorization;
      return config;
    }

    // Chỉ attach token nếu có
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    // Nếu gửi FormData thì để trình duyệt tự set multipart boundary
    if (config.data instanceof FormData) {
      delete (config.headers as any)['Content-Type'];
    } else {
      // Mặc định cho JSON
      (config.headers as any)['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ===================== RESPONSE INTERCEPTOR =====================
api.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes('login')) {
      console.log('Login response interceptor - Original response:', response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Không retry cho login request để tránh vòng lặp vô hạn
    if (originalRequest.url?.includes('login')) {
      console.log('Login request error interceptor:', error.response?.data);
      return Promise.reject({
        message: error.response?.data?.message || error.message || 'Login failed',
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    // Xử lý 401 với logic đơn giản
    if (
      isUnauthorizedError(error.response?.status) &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('login') &&
      !originalRequest.url?.includes('refresh-token')
    ) {
      originalRequest._retry = true;

      try {
        console.log('🔄 401 Unauthorized, attempting token refresh...');
        
        // Gọi refresh token API
        const response = await api.get('Account/refresh-token');
        const newToken = response.data.Data.accessToken;
        
        if (!newToken) {
          throw new Error('No access token received');
        }

        // Cập nhật token mới
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.log('❌ Token refresh failed, redirecting to login');
        
        // Clear auth và redirect
        clearAuthToken();
        useAuthStore.getState().setUser(null);
        showToast.error('Phiên đăng nhập đã hết', 'Vui lòng đăng nhập lại để tiếp tục.');
        window.location.href = '/login';
        
        return Promise.reject(err);
      }
    }

    // Xử lý timeout và network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject({ 
          message: 'Request timeout. Vui lòng thử lại.', 
          status: 408 
        });
      }
      return Promise.reject({ 
        message: 'Network Error. Vui lòng kiểm tra kết nối mạng.', 
        status: 0 
      });
    }

    return Promise.reject({
      message:
        error.response.data?.message || error.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data,
    });
  },
);