import isUnauthorizedError from '@/utils/httpStatus';
import { isTokenValid } from '@/utils/jwt';
import axios from 'axios';
import { clearAuthToken, useAuthStore } from '../storage/tokenStorage';
import { showToast } from '@/utils/toastManager';

export const api = axios.create({
  baseURL: 'https://bookingpickleball.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'cache-control': 'no-cache',
  },
  timeout: 30000,
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
      // const refreshed = await store.refreshTokenAsync();
      // if (!refreshed) {
      //   clearAuthToken();
      //   return config;
      // }
      token = localStorage.getItem('token');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ===================== RESPONSE INTERCEPTOR =====================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      isUnauthorizedError(error.response?.status) &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('login')
    ) {
      originalRequest._retry = true;

      try {
        const store = useAuthStore.getState();
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) throw new Error('No refresh token found');

        // const refreshed = await store.refreshTokenAsync(refreshToken);
        // if (!refreshed) throw new Error('Token refresh failed');

        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        return api(originalRequest);
      } catch (err) {
        clearAuthToken();
        useAuthStore.getState().setUser(null);

        // Hiển thị thông báo bằng toast
        showToast.error('Phiên đăng nhập đã hết', 'Vui lòng đăng nhập lại để tiếp tục.');

        // Điều hướng về trang đăng nhập
        window.location.href = '/login';

        return Promise.reject(err);
      }
    }

    if (!error.response) {
      return Promise.reject({ message: 'Network Error' });
    }

    return Promise.reject({
      message:
        error.response.data.message || error.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data,
    });
  },
);
