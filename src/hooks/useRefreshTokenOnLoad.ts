import { useEffect } from 'react';
import { useAuthStore } from '@/infrastructure/storage/tokenStorage';
import { isTokenValid } from '@/utils/jwt';

/**
 * Hook để refresh token khi vào trang (chỉ khi token sắp hết hạn)
 * Không refresh liên tục để tránh overhead
 */
export const useRefreshTokenOnLoad = () => {
  const refreshTokenAsync = useAuthStore((state) => state.refreshTokenAsync);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const refreshIfNeeded = async () => {
      // Chỉ refresh nếu có token và token sắp hết hạn (trong vòng 2 phút)
      if (token && isTokenValid(token)) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000;
          const timeUntilExpiry = expirationTime - Date.now();
          
          // Nếu token hết hạn trong vòng 2 phút, refresh ngay
          if (timeUntilExpiry < 2 * 60 * 1000) {
            console.log('🔄 Token expires soon, refreshing on page load...');
            await refreshTokenAsync();
          } else {
            console.log('✅ Token still valid, no refresh needed');
          }
        } catch (error) {
          console.error('❌ Error checking token expiry:', error);
        }
      }
    };

    refreshIfNeeded();
  }, [refreshTokenAsync, token]);
};
