import apiClient from '../client';
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
  // Add backend logout endpoint call here if one exists
  // await apiClient.post('/auth/logout');
};
