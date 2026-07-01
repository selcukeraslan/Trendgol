// Placeholder/mock kimlik doğrulama. Gerçek backend gelince burası gerçek
// oturum/token yönetimine bağlanacak; bileşen arayüzü (login/logout) aynı kalır.

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  /** Persist verisi tarayıcıda yüklendi mi? (SSR/hydration koruması) */
  hasHydrated: boolean;
  login: (user: string) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      hasHydrated: false,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "halisaha:auth",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
