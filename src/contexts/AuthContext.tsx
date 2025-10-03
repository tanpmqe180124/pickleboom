import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  accessToken: string | null;
  userID: string | null;
  userRole: string | null;
  setAccessToken: (token: string | null) => void;
  setUserID: (id: string | null) => void;
  setUserRole: (role: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [userID, setUserIDState] = useState<string | null>(() => localStorage.getItem('userID'));
  const [userRole, setUserRoleState] = useState<string | null>(() => localStorage.getItem('userRole'));

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
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
  };

  useEffect(() => {
    const handleStorage = () => {
      setAccessTokenState(localStorage.getItem('accessToken'));
      setUserIDState(localStorage.getItem('userID'));
      setUserRoleState(localStorage.getItem('userRole'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, userID, userRole, setAccessToken, setUserID, setUserRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 