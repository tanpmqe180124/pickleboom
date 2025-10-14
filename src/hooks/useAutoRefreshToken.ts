import { useEffect } from 'react';
import { useAuthStore } from '@/infrastructure/storage/tokenStorage';

/**
 * Hook để tự động refresh token khi component mount
 * Đảm bảo luôn có token mới nhất khi vào trang
 */
export const useAutoRefreshToken = () => {
  const refreshTokenAsync = useAuthStore((state) => state.refreshTokenAsync);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const autoRefresh = async () => {
      // Chỉ refresh nếu có token
      if (token) {
        console.log('🚀 Auto refreshing token on page load...');
        try {
          const refreshed = await refreshTokenAsync();
          if (refreshed) {
            console.log('✅ Auto refresh successful');
          } else {
            console.log('❌ Auto refresh failed');
          }
        } catch (error) {
          console.error('❌ Auto refresh error:', error);
        }
      }
    };

    // Refresh ngay khi component mount
    autoRefresh();

    // Refresh định kỳ mỗi 4 phút để đảm bảo token luôn fresh
    const interval = setInterval(autoRefresh, 4 * 60 * 1000); // 4 phút

    return () => {
      clearInterval(interval);
    };
  }, [refreshTokenAsync, token]);
};
