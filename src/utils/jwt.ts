export function isTokenValid(token: any) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = payload.exp * 1000;
    return Date.now() < expirationDate;
  } catch {
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
