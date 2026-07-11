import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { api, setToken, getToken } from './api';
import type { User, AuthResponse } from './types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<{
        success: boolean;
        message: string;
        data: { user: User };
      }>('/auth/me')
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));

    const handler = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handler);

    return () =>
      window.removeEventListener('auth:unauthorized', handler);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const res = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });

    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}