import apiClient from '../client';
import type { AuthUser } from '@/types/auth';

export type CreateUserPayload = Omit<AuthUser, 'id'> & { password?: string };
export type UpdateUserPayload = Partial<CreateUserPayload>;

export const getUsers = (): Promise<AuthUser[]> =>
  apiClient.get('/auth/users').then(r => r.data.users);

export const createUser = (data: CreateUserPayload): Promise<AuthUser> =>
  apiClient.post('/auth/users', data).then(r => r.data.user);

export const updateUser = (id: string, data: UpdateUserPayload): Promise<AuthUser> =>
  apiClient.patch(`/auth/users/${id}`, data).then(r => r.data.user);

export const deleteUser = (id: string): Promise<string> =>
  apiClient.delete(`/auth/users/${id}`).then(() => id);
