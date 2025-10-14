import isUnauthorizedError from '@/utils/httpStatus';
import { isTokenValid } from '@/utils/jwt';
import axios from 'axios';
import { clearAuthToken, clearRefreshTokenCookie, useAuthStore } from '../storage/tokenStorage';
import { showToast } from '@/utils/toastManager';

// ===================== REFRESH TOKEN QUEUE SYSTEM =====================
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

export const api = axios.create({
  baseURL: 'https://bookingpickleball.onrender.com/api',
  headers: {
    Accept: 'application/json',
    'cache-control': 'no-cache',
  },
  timeout: 120000, // 2 phút (120 giây)
  withCredentials: true, // Thêm dòng này để gửi cookie
});

// ===================== REQUEST INTERCEPTOR =====================
api.interceptors.request.use(
  async (config) => {
    if (config.url?.includes('Account/login')) {
      delete config.headers.Authorization;
      return config;
    }

    let token = localStorage.getItem('token');
    
    // Chỉ attach token nếu có, để response interceptor handle refresh
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

    // Xử lý 401 với queue system
    if (
      isUnauthorizedError(error.response?.status) &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('login') &&
      !originalRequest.url?.includes('refresh-token')
    ) {
      // Nếu đang refresh, thêm request vào queue
      if (isRefreshing) {
        console.log('🔄 Already refreshing, adding request to queue...');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const store = useAuthStore.getState();
        console.log('🔄 401 Unauthorized, attempting token refresh...');
        
        const refreshed = await store.refreshTokenAsync();
        if (!refreshed) throw new Error('Token refresh failed');

        const newToken = localStorage.getItem('token');
        if (!newToken) throw new Error('No token received');

        // Cập nhật default header
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        // Process queue với token mới
        processQueue(null, newToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.log('❌ Token refresh failed, redirecting to login');
        
        // Process queue với error
        processQueue(err, null);
        
        // Clear auth và redirect
        clearAuthToken();
        useAuthStore.getState().setUser(null);
        showToast.error('Phiên đăng nhập đã hết', 'Vui lòng đăng nhập lại để tiếp tục.');
        window.location.href = '/login';
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
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
