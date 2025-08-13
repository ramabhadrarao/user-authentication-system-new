import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePhotoUrl?: string;
  permissions: string[];
  isMasterAdmin: boolean;
  approved: boolean;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: { login: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const login = async (credentials: { login: string; password: string }) => {
    try {
      const response = await apiService.login(credentials);
      const { token: newToken, user: userData } = response;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const register = async (userData: any) => {
    try {
      await apiService.register(userData);
    } catch (error) {
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.isMasterAdmin) return true;
    return user.permissions.includes(permission);
  };

  const checkAuthStatus = async () => {
    if (token) {
      try {
        const response = await apiService.getCurrentUser();
        setUser(response.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    register,
    updateUser,
    hasPermission,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};