import apiClient from '../client';
import type { LoginPayload, LoginResponse, MeResponse } from '@/types/auth';

export const login = (payload: LoginPayload): Promise<LoginResponse> =>
  apiClient.post('/auth/login', payload).then(r => r.data);

export const getMe = (): Promise<MeResponse> => apiClient.get('/auth/me').then(r => r.data);

export const logout = (): Promise<void> => apiClient.post('/auth/logout').then(() => undefined);
