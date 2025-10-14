import { useEffect } from 'react';
import { useAuthStore } from '@/infrastructure/storage/tokenStorage';
import { isTokenValid } from '@/utils/jwt';

/**
 * Hook để tự động refresh token khi cần thiết
 * - Refresh khi vào trang nếu token sắp hết hạn
 * - Tự động refresh sau 4 phút để tránh token hết hạn
 */
export const useRefreshTokenOnLoad = () => {
  const refreshTokenAsync = useAuthStore((state) => state.refreshTokenAsync);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const refreshIfNeeded = async () => {
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
            console.log('🔄 Token expired or expires soon, refreshing...');
            await refreshTokenAsync();
          } else {
            console.log('✅ Token still valid');
          }
        } catch (error) {
          console.error('❌ Error checking token expiry:', error);
          // Nếu không parse được token, thử refresh
          console.log('🔄 Token invalid format, attempting refresh...');
          await refreshTokenAsync();
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
