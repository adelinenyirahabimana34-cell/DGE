import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';
import { setAuthToken } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string, address?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = '@dg_auth_token';
const USER_KEY = '@dg_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  // Load persisted session on app start
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const userStr = await AsyncStorage.getItem(USER_KEY);
        if (token && userStr) {
          const user: User = JSON.parse(userStr);
          setAuthToken(token);
          setState({ user, token, isLoading: false });
        } else {
          setState(s => ({ ...s, isLoading: false }));
        }
      } catch {
        setState(s => ({ ...s, isLoading: false }));
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await authService.login(email, password);
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    setAuthToken(token);
    setState({ user, token, isLoading: false });
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    address?: string,
  ) => {
    const { token, user } = await authService.register({ name, email, password, phone, address });
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    setAuthToken(token);
    setState({ user, token, isLoading: false });
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    setAuthToken(null);
    setState({ user: null, token: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
