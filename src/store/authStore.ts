import { create } from 'zustand';

import type { AuthUser, ModuleKey } from '@/types/auth';
import {
  saveAuthTokens,
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  getAuthUser,
  getAuthModules,
  setAuthUser,
  setAuthModules,
} from '@/api/storage';
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
  /** Update just the tokens in the store and SecureStore */
  updateTokens: (accessToken: string, refreshToken: string) => Promise<void>;
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
      await setAuthUser(user);
      await setAuthModules(modules);
    } catch (error) {
      logger.error('Failed to save auth tokens/user:', error);
      // Optionally handle the error (e.g., show an alert or throw)
    }
    set({
      accessToken,
      refreshToken,
      user,
      modules,
      isAuthenticated: true,
    });
  },

  clearSession: async () => {
    try {
      await clearAuthTokens();
    } catch (error) {
      logger.error('Failed to clear auth tokens:', error);
    }
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      modules: [],
      isAuthenticated: false,
    });
  },

  updateTokens: async (accessToken, refreshToken) => {
    try {
      await saveAuthTokens(accessToken, refreshToken);
    } catch (error) {
      logger.error('Failed to save refreshed auth tokens:', error);
    }
    set({ accessToken, refreshToken });
  },

  restoreSession: async () => {
    try {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (accessToken && refreshToken) {
        // Mock phase: Hydrating user and modules directly from SecureStore
        // On a real backend, you could call /auth/me here instead if preferred
        const user = await getAuthUser();
        const modules = await getAuthModules();

        set({
          accessToken,
          refreshToken,
          user,
          modules,
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
