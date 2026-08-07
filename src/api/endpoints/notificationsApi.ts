import apiClient from '../client';
import type { AppNotification, NotificationsResponse } from '@/types/notification';

export const getNotifications = (): Promise<NotificationsResponse> =>
  apiClient.get('/notifications').then(r => r.data);

export const markNotificationAsRead = (id: string): Promise<AppNotification> =>
  apiClient.patch(`/notifications/${id}/read`).then(r => r.data);

export const markAllNotificationsAsRead = (): Promise<{ success: boolean }> =>
  apiClient.post('/notifications/mark-all-read').then(r => r.data);
