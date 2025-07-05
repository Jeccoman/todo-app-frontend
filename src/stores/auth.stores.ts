import { apiClient } from '@/lib/api-client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await apiClient.post('/auth/login', { email, password });
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      register: async (name: string, email: string, password: string) => {
        const response = await apiClient.post('/auth/register', { name, email, password });
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const response = await apiClient.get('/auth/me');
          set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);