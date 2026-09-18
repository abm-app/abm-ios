import apiClient from '../client';
import logger from '@/utils/logger';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
  const loginRes = await apiClient.post('/auth/login', payload);
  const { accessToken, refreshToken } = loginRes.data;

  // The login endpoint returns a basic user profile, but the frontend needs
  // the 'modules' array which is returned by the /auth/me endpoint.
  const meRes = await apiClient.get('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    accessToken,
    refreshToken,
    user: meRes.data.user,
    modules: meRes.data.modules,
  };
};

export const logout = async (): Promise<void> => {
  // Best-effort — a device that keeps a stale token after logout would receive the next
  // logged-in user's push notifications, but a failed clear should never block the actual
  // local logout (session is always cleared regardless, see useLogout.ts's onSettled).
  try {
    await apiClient.delete('/auth/push-token');
  } catch (error) {
    logger.warn('[authApi] Failed to clear push token on logout', error);
  }
};

export const registerPushToken = (pushToken: string): Promise<{ status: string }> =>
  apiClient.patch('/auth/push-token', { pushToken }).then(r => r.data);
