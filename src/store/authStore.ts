import { create } from 'zustand';

import type { AuthUser, ModuleKey, UserRole } from '@/types/auth';
import { saveAuthTokens, clearAuthTokens, getAccessToken, getRefreshToken } from '@/api/storage';

// ─── State shape ─────────────────────────────────────────────────────────────

interface AuthState {
  /** JWT access token — null when logged out. */
  accessToken: string | null;
  /** JWT refresh token — null when logged out. */
  refreshToken: string | null;
  /** Current user profile — null when logged out. */
  user: AuthUser | null;

  // ── Derived (convenience getters) ──────────────────────────────────────────
  isAuthenticated: boolean;
  role: UserRole | null;
  modules: ModuleKey[];
}

// ─── Actions ─────────────────────────────────────────────────────────────────

interface AuthActions {
  /** Persist tokens + user after a successful login. */
  setAuth: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  /** Update user profile (e.g. after /auth/me). */
  setUser: (user: AuthUser) => void;
  /** Clear everything and remove tokens from secure-store. */
  logout: () => void;
  /** Hydrate store from secure-store on app launch. Returns true if tokens existed. */
  hydrate: () => Promise<boolean>;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>(set => ({
  // ── Initial state ──────────────────────────────────────────────────────────
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  role: null,
  modules: [],

  // ── Actions ────────────────────────────────────────────────────────────────

  setAuth: (accessToken, refreshToken, user) => {
    void saveAuthTokens(accessToken, refreshToken);
    set({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true,
      role: user.role,
      modules: user.modules,
    });
  },

  setUser: user => {
    set({
      user,
      role: user.role,
      modules: user.modules,
    });
  },

  logout: () => {
    void clearAuthTokens();
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      role: null,
      modules: [],
    });
  },

  hydrate: async () => {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();

    if (accessToken && refreshToken) {
      set({ accessToken, refreshToken, isAuthenticated: true });
      return true;
    }
    return false;
  },
}));

// ─── Direct store reference (for non-React code like Axios interceptors) ─────

export const authStore = useAuthStore;
