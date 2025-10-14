import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/infrastructure/storage/tokenStorage';
import { isTokenValid } from '@/utils/jwt';

/**
 * Hook để tự động refresh token khi cần thiết
 * - Refresh khi vào trang nếu token sắp hết hạn
 * - Tự động refresh sau 4 phút để tránh token hết hạn
 * - Tránh gọi refresh liên tục khi đã 401
 */
export const useRefreshTokenOnLoad = () => {
  const refreshTokenAsync = useAuthStore((state) => state.refreshTokenAsync);
  const token = useAuthStore((state) => state.token);
  const isRefreshing = useRef(false);
  const lastRefreshTime = useRef(0);

  useEffect(() => {
    const refreshIfNeeded = async () => {
      console.log('🔍 useRefreshTokenOnLoad - Starting refresh check...');
      console.log('🔍 Current token:', token ? 'EXISTS' : 'NULL');
      console.log('🔍 Document cookies:', document.cookie);
      
      // Tránh gọi refresh liên tục
      if (isRefreshing.current) {
        console.log('⏳ Refresh already in progress, skipping...');
        return;
      }

      // Chỉ refresh nếu có token
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000;
          const timeUntilExpiry = expirationTime - Date.now();
          
          console.log('🔍 Token check:', {
            expiresAt: new Date(expirationTime).toISOString(),
            timeUntilExpiry: Math.round(timeUntilExpiry / 1000) + 's',
            isValid: isTokenValid(token)
          });
          
          // Nếu token hết hạn hoặc sắp hết hạn (trong vòng 1 phút), refresh ngay
          if (!isTokenValid(token) || timeUntilExpiry < 60 * 1000) {
            // Tránh gọi refresh quá thường xuyên (ít nhất 30 giây)
            const now = Date.now();
            if (now - lastRefreshTime.current < 30000) {
              console.log('⏳ Refresh too recent, skipping...');
              return;
            }

            console.log('🔄 Token expired or expires soon, refreshing...');
            isRefreshing.current = true;
            lastRefreshTime.current = now;
            
            const success = await refreshTokenAsync();
            
            if (!success) {
              console.log('❌ Refresh failed, stopping auto refresh');
              // Nếu refresh thất bại, KHÔNG clear auth - để axios interceptor handle
              console.log('🔄 Let axios interceptor handle the 401 error');
              return;
            }
            
            isRefreshing.current = false;
          } else {
            console.log('✅ Token still valid');
          }
        } catch (error) {
          console.error('❌ Error checking token expiry:', error);
          // Nếu không parse được token, thử refresh
          console.log('🔄 Token invalid format, attempting refresh...');
          
          if (!isRefreshing.current) {
            isRefreshing.current = true;
            await refreshTokenAsync();
            isRefreshing.current = false;
          }
        }
      }
    };

    // Refresh ngay khi vào trang
    refreshIfNeeded();

    // Tự động refresh sau 4 phút để tránh token hết hạn
    const interval = setInterval(refreshIfNeeded, 4 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [refreshTokenAsync, token]);
};
