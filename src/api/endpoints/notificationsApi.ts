import { isAxiosError } from 'axios';

import apiClient from '../client';
import logger from '@/utils/logger';
import type { AppNotification, NotificationsResponse } from '@/types/notification';

export async function getNotifications(): Promise<NotificationsResponse> {
  try {
    const response = await apiClient.get<NotificationsResponse>('/notifications');
    logger.info('[getNotifications] Retrieved notifications', {
      count: response.data.notifications.length,
      unreadCount: response.data.unreadCount,
    });
    return response.data;
  } catch (error) {
    logger.error('[getNotifications] Failed to fetch notifications', {
      message: error instanceof Error ? error.message : String(error),
      status: isAxiosError(error) ? error.response?.status : undefined,
    });
    throw error;
  }
}

export async function markNotificationAsRead(id: string): Promise<AppNotification> {
  const response = await apiClient.patch<AppNotification>(`/notifications/${id}/read`);
  return response.data;
}

export async function markAllNotificationsAsRead(): Promise<{ success: boolean }> {
  const response = await apiClient.post<{ success: boolean }>('/notifications/mark-all-read');
  return response.data;
}
