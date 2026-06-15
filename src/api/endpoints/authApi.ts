import apiClient from '../client';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export const login = (payload: LoginRequest): Promise<LoginResponse> =>
  apiClient.post('/auth/login', payload).then(r => r.data);

export const logout = (): Promise<void> => apiClient.post('/auth/logout').then(() => undefined);
