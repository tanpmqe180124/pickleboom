import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  accessToken: string | null;
  userID: string | null;
  userRole: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string | null) => void;
  setUserID: (id: string | null) => void;
  setUserRole: (role: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    const token = localStorage.getItem('token');
    console.log('AuthContext - Initial accessToken from localStorage:', token);
    return token;
  });
  const [userID, setUserIDState] = useState<string | null>(() => localStorage.getItem('userID'));
  const [userRole, setUserRoleState] = useState<string | null>(() => {
    const role = localStorage.getItem('userRole');
    console.log('AuthContext - Initial userRole from localStorage:', role);
    return role;
  });

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  const setUserID = (id: string | null) => {
    setUserIDState(id);
    if (id) {
      localStorage.setItem('userID', id);
    } else {
      localStorage.removeItem('userID');
    }
  };

  const setUserRole = (role: string | null) => {
    setUserRoleState(role);
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUserID(null);
    setUserRole(null);
    // Xóa tất cả auth data khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('userRole');
  };

  useEffect(() => {
    const handleStorage = () => {
      setAccessTokenState(localStorage.getItem('token'));
      setUserIDState(localStorage.getItem('userID'));
      setUserRoleState(localStorage.getItem('userRole'));
    };
    
    const handleUserRoleUpdate = (event: CustomEvent) => {
      console.log('AuthContext - Received userRoleUpdated event:', event.detail);
      console.log('AuthContext - Setting userRole to:', event.detail.userRole);
      setUserRoleState(event.detail.userRole);
    };
    
    window.addEventListener('storage', handleStorage);
    window.addEventListener('userRoleUpdated', handleUserRoleUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('userRoleUpdated', handleUserRoleUpdate as EventListener);
    };
  }, []);

  const isAuthenticated = accessToken !== null && accessToken !== undefined && accessToken !== '';
  
  console.log('AuthContext - accessToken:', accessToken);
  console.log('AuthContext - isAuthenticated:', isAuthenticated);
  console.log('AuthContext - userRole:', userRole);

  return (
    <AuthContext.Provider value={{ accessToken, userID, userRole, isAuthenticated, setAccessToken, setUserID, setUserRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 