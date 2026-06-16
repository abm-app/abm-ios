import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
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

// ─── Bulk helpers ────────────────────────────────────────────────────────────

export async function saveAuthTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([setAccessToken(accessToken), setRefreshToken(refreshToken)]);
}

export async function clearAuthTokens(): Promise<void> {
  await Promise.all([deleteAccessToken(), deleteRefreshToken()]);
}
