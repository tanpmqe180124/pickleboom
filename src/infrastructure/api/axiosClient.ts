import isUnauthorizedError from '@/utils/httpStatus';
import { isTokenValid } from '@/utils/jwt';
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
    const store = useAuthStore.getState();

    if (token && !isTokenValid(token)) {
      console.log('🔄 Token expired, attempting refresh...');
      const refreshed = await store.refreshTokenAsync();
      if (!refreshed) {
        console.log('❌ Token refresh failed, clearing auth...');
        clearAuthToken();
        return config;
      }
      token = localStorage.getItem('token');
      console.log('✅ Token refreshed successfully');
    }

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

    if (
      isUnauthorizedError(error.response?.status) &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('login')
    ) {
      originalRequest._retry = true;

      try {
        const store = useAuthStore.getState();

        console.log('🔄 401 Unauthorized, attempting token refresh...');
        const refreshed = await store.refreshTokenAsync();
        if (!refreshed) throw new Error('Token refresh failed');

        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        return api(originalRequest);
      } catch (err) {
        console.log('❌ Token refresh failed, redirecting to login');
        clearAuthToken();
        useAuthStore.getState().setUser(null);

        // Hiển thị thông báo bằng toast
        showToast.error('Phiên đăng nhập đã hết', 'Vui lòng đăng nhập lại để tiếp tục.');

        // Điều hướng về trang đăng nhập
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
