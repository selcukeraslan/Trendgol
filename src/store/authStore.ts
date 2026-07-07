// Kimlik doğrulama store'u. Oturum yönetimini authService'e devreder; böylece
// backend (Supabase) geldiğinde yalnızca authService değişir, store değişmez.

import { create } from "zustand";

import type { AuthUser, Credentials } from "@/lib/auth/authService";
import { signIn, signOut, getSession } from "@/lib/auth/authService";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Oturum bilgisi tarayıcıda yüklendi mi? (SSR/hydration koruması) */
  hasHydrated: boolean;
  hydrate: () => Promise<void>;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  hasHydrated: false,
  hydrate: async () => {
    const session = await getSession();
    set({
      user: session?.user ?? null,
      isAuthenticated: !!session,
      hasHydrated: true,
    });
  },
  login: async (credentials) => {
    const session = await signIn(credentials);
    set({ user: session.user, isAuthenticated: true });
  },
  logout: async () => {
    await signOut();
    set({ user: null, isAuthenticated: false });
  },
}));
