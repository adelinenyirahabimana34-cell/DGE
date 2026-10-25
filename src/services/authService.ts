import api from './api';
import { User } from '../types';

interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>('/auth/login', { email, password });
    return res.data;
  },

  register: async (data: RegisterData): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>('/auth/register', data);
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<{ user: User }>('/auth/me');
    return res.data.user;
  },
};
