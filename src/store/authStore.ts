import { create } from 'zustand';

import type { AuthUser, ModuleKey } from '@/types/auth';
import {
  saveAuthSession,
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  getAuthUser,
  getAuthModules,
} from '@/api/storage';

// ─── State shape ─────────────────────────────────────────────────────────────

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  modules: ModuleKey[];
  isAuthenticated: boolean;
  isRestoring: boolean;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

interface AuthActions {
  /** Write tokens to SecureStore then set authenticated state. */
  setSession: (
    accessToken: string,
    refreshToken: string,
    user: AuthUser,
    modules: ModuleKey[],
  ) => void;
  /** Delete tokens from SecureStore and clear all auth state. */
  clearSession: () => void;
  /** Read SecureStore on app launch. Sets isRestoring false when done. */
  restoreSession: () => Promise<void>;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>(set => ({
  // ── Initial state ──────────────────────────────────────────────────────────
  accessToken: null,
  refreshToken: null,
  user: null,
  modules: [],
  isAuthenticated: false,
  isRestoring: true,

  // ── Actions ────────────────────────────────────────────────────────────────

  setSession: (accessToken, refreshToken, user, modules) => {
    void saveAuthSession(accessToken, refreshToken, user, modules);
    set({
      accessToken,
      refreshToken,
      user,
      modules,
      isAuthenticated: true,
    });
  },

  clearSession: () => {
    void clearAuthSession();
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      modules: [],
      isAuthenticated: false,
    });
  },

  restoreSession: async () => {
    try {
      const [accessToken, refreshToken, user, modules] = await Promise.all([
        getAccessToken(),
        getRefreshToken(),
        getAuthUser(),
        getAuthModules(),
      ]);

      if (accessToken && refreshToken) {
        set({
          accessToken,
          refreshToken,
          user,
          modules: modules ?? [],
          isAuthenticated: true,
        });
      }

      set({ isRestoring: false });
    }
  },
}));

// ─── Direct store reference (for non-React code like Axios interceptors) ─────

export const authStore = useAuthStore;
