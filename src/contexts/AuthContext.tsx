import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  accessToken: string | null;
  userID: string | null;
  setAccessToken: (token: string | null) => void;
  setUserID: (id: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [userID, setUserIDState] = useState<string | null>(() => localStorage.getItem('userID'));

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

  const logout = () => {
    setAccessToken(null);
    setUserID(null);
  };

  useEffect(() => {
    const handleStorage = () => {
      setAccessTokenState(localStorage.getItem('accessToken'));
      setUserIDState(localStorage.getItem('userID'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, userID, setAccessToken, setUserID, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 