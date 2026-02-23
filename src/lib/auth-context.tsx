'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

interface AuthState {
  isAdmin: boolean;
  isLoading: boolean;
  isMounted: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'echoverse123';
const AUTH_STORAGE_KEY = 'echoverse_admin_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Only read from localStorage on the client to avoid hydration mismatches
    if (typeof window === 'undefined') {
      return {
        isAdmin: false,
        isLoading: true,
        isMounted: false,
      };
    }
    
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    return {
      isAdmin: !!token,
      isLoading: false,
      isMounted: true,
    };
  });

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setAuthState(prev => ({
        ...prev,
        isAdmin: true,
      }));
      localStorage.setItem(AUTH_STORAGE_KEY, 'authenticated');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      isAdmin: false,
    }));
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin: authState.isAdmin, login, logout, isLoading: authState.isLoading }}>
      <div suppressHydrationWarning>
        {children}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
