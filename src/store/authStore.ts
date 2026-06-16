import { create } from 'zustand';

import type { AuthUser, ModuleKey } from '@/types/auth';
import { saveAuthTokens, clearAuthTokens, getAccessToken, getRefreshToken } from '@/api/storage';
import logger from '@/utils/logger';

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
  ) => Promise<void>;
  /** Delete tokens from SecureStore and clear all auth state. */
  clearSession: () => Promise<void>;
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

  setSession: async (accessToken, refreshToken, user, modules) => {
    try {
      await saveAuthTokens(accessToken, refreshToken);
      set({
        accessToken,
        refreshToken,
        user,
        modules,
        isAuthenticated: true,
      });
    } catch (error) {
      logger.error('Failed to save auth tokens:', error);
      // Optionally handle the error (e.g., show an alert or throw)
    }
  },

  clearSession: async () => {
    try {
      await clearAuthTokens();
      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        modules: [],
        isAuthenticated: false,
      });
    } catch (error) {
      logger.error('Failed to clear auth tokens:', error);
    }
  },

  restoreSession: async () => {
    try {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (accessToken && refreshToken) {
        // Mock phase: tokens exist but user/modules are not persisted in SecureStore.
        // On a real backend, call /auth/me here to hydrate user and modules.
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      }
    } finally {
      set({ isRestoring: false });
    }
  },
}));

// ─── Direct store reference (for non-React code like Axios interceptors) ─────

export const authStore = useAuthStore;
