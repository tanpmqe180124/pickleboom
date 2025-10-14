export function isTokenValid(token: any) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = payload.exp * 1000;
    const isValid = Date.now() < expirationDate;
    
    console.log('🔍 Token validation:', {
      token: token ? token.substring(0, 20) + '...' : 'null',
      expirationDate: new Date(expirationDate).toISOString(),
      currentTime: new Date().toISOString(),
      isValid: isValid,
      timeUntilExpiry: expirationDate - Date.now()
    });
    
    return isValid;
  } catch {
    console.log('❌ Token validation failed - invalid token format');
    return false;
  }
}

export function getValidPayload(token: any) {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Debug function để test refresh token
export function debugTokenInfo() {
  const token = localStorage.getItem('token');
  console.log('🔍 Current token info:', {
    exists: !!token,
    valid: token ? isTokenValid(token) : false,
    payload: token ? getValidPayload(token) : null
  });
  
  if (token) {
    const payload = getValidPayload(token);
    if (payload) {
      console.log('📅 Token expires at:', new Date(payload.exp * 1000).toISOString());
      console.log('⏰ Time until expiry:', payload.exp * 1000 - Date.now(), 'ms');
    }
  }
}
