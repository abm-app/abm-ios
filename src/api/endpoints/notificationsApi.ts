import apiClient from '../client';
import type { AppNotification, NotificationsResponse } from '@/types/notification';

export async function getNotifications(): Promise<NotificationsResponse> {
  const response = await apiClient.get<NotificationsResponse>('/notifications');
  return response.data;
}

export async function markNotificationAsRead(id: string): Promise<AppNotification> {
  const response = await apiClient.patch<AppNotification>(`/notifications/${id}/read`);
  return response.data;
}

export async function markAllNotificationsAsRead(): Promise<{ success: boolean }> {
  const response = await apiClient.post<{ success: boolean }>('/notifications/mark-all-read');
  return response.data;
}
