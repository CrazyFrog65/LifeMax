import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => { throw new Error('AuthContext not initialized'); },
  register: async () => { throw new Error('AuthContext not initialized'); },
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await apiClient.get('http://localhost:5000/api/auth/me');
          if (res.data.success && res.data.data) {
            setUser(res.data.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Failed to verify token on startup', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = await apiClient.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (res.data.success && res.data.data) {
        const { user: loggedInUser, token } = res.data.data;
        localStorage.setItem('token', token);
        setUser(loggedInUser);
        return loggedInUser;
      } else {
        throw new Error(res.data.message || 'Login failed');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed';
      throw new Error(errMsg);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    try {
      const res = await apiClient.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });

      if (res.data.success && res.data.data) {
        const { user: registeredUser, token } = res.data.data;
        localStorage.setItem('token', token);
        setUser(registeredUser);
        return registeredUser;
      } else {
        throw new Error(res.data.message || 'Registration failed');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Registration failed';
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
