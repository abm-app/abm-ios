import * as SecureStore from 'expo-secure-store';

import type { AuthUser, ModuleKey } from '@/types/auth';

const KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
  MODULES: 'auth_modules',
} as const;

// ─── Access Token ────────────────────────────────────────────────────────────

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
}

export async function setAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
}

export async function deleteAccessToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
}

// ─── Refresh Token ───────────────────────────────────────────────────────────

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
}

export async function setRefreshToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
}

export async function deleteRefreshToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
}

// ─── User ────────────────────────────────────────────────────────────────────

export async function getAuthUser(): Promise<AuthUser | null> {
  const raw = await SecureStore.getItemAsync(KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function setAuthUser(user: AuthUser): Promise<void> {
  await SecureStore.setItemAsync(KEYS.USER, JSON.stringify(user));
}

export async function deleteAuthUser(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.USER);
}

// ─── Modules ─────────────────────────────────────────────────────────────────

export async function getAuthModules(): Promise<ModuleKey[] | null> {
  const raw = await SecureStore.getItemAsync(KEYS.MODULES);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ModuleKey[];
  } catch {
    return null;
  }
}

export async function setAuthModules(modules: ModuleKey[]): Promise<void> {
  await SecureStore.setItemAsync(KEYS.MODULES, JSON.stringify(modules));
}

export async function deleteAuthModules(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.MODULES);
}

// ─── Bulk helpers ────────────────────────────────────────────────────────────

export async function saveAuthSession(
  accessToken: string,
  refreshToken: string,
  user: AuthUser,
  modules: ModuleKey[],
): Promise<void> {
  await Promise.all([
    setAccessToken(accessToken),
    setRefreshToken(refreshToken),
    setAuthUser(user),
    setAuthModules(modules),
  ]);
}

export async function clearAuthSession(): Promise<void> {
  await Promise.all([
    deleteAccessToken(),
    deleteRefreshToken(),
    deleteAuthUser(),
    deleteAuthModules(),
  ]);
}
