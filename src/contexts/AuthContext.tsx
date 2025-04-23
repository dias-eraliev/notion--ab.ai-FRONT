import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api';

export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

interface Profile {
  id: number;
  name: string;
  surname: string;
  groups?: number[]; // For students and teachers
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  role: Role | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    token: localStorage.getItem('token'),
    role: null,
    profile: null,
    loading: true,
    error: null
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      setState(prev => ({ ...prev, loading: true }));
      const token = localStorage.getItem('token');
      const profileStr = localStorage.getItem('profile');
      const role = localStorage.getItem('role') as Role | null;

      if (token && profileStr && role) {
        try {
          // Verify token
          const profile = JSON.parse(profileStr);
          setState({
            isAuthenticated: true,
            token,
            role,
            profile,
            loading: false,
            error: null
          });
        } catch (error) {
          // Invalid stored data
          localStorage.removeItem('token');
          localStorage.removeItem('profile');
          localStorage.removeItem('role');
          setState({
            isAuthenticated: false,
            token: null,
            role: null,
            profile: null,
            loading: false,
            error: null
          });
        }
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, role, profile } = response.data;

      // Save auth data
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('profile', JSON.stringify(profile));

      setState({
        isAuthenticated: true,
        token,
        role,
        profile,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Login failed:', error);
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        token: null,
        role: null,
        profile: null,
        loading: false,
        error: 'Ошибка авторизации. Пожалуйста, проверьте ваши учетные данные.'
      }));
    }
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('profile');
    
    setState({
      isAuthenticated: false,
      token: null,
      role: null,
      profile: null,
      loading: false,
      error: null
    });
  };

  const hasRole = (roles: Role[]) => {
    if (!state.role) return false;
    return roles.includes(state.role);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 