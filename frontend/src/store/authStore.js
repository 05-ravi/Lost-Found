import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, token) => set({ 
        user, 
        accessToken: token, 
        isAuthenticated: !!user 
      }),

      clearAuth: () => set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false 
      }),

      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
