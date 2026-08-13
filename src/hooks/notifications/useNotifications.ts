import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/api/endpoints/notificationsApi';
import type { NotificationsResponse } from '@/types/notification';

export const notificationKeys = {
  all: ['notifications'] as const,
};

export function useNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: notificationKeys.all,
    queryFn: getNotifications,
    retry: false,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: updatedNotification => {
      queryClient.setQueryData<NotificationsResponse>(notificationKeys.all, oldData => {
        if (!oldData) return oldData;
        const newNotifications = oldData.notifications.map(item =>
          item.id === updatedNotification.id ? updatedNotification : item,
        );
        const unreadCount = newNotifications.filter(item => !item.read).length;
        return {
          ...oldData,
          notifications: newNotifications,
          unreadCount,
        };
      });
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.setQueryData<NotificationsResponse>(notificationKeys.all, oldData => {
        if (!oldData) return oldData;
        const newNotifications = oldData.notifications.map(item => ({
          ...item,
          read: true,
        }));
        return {
          ...oldData,
          notifications: newNotifications,
          unreadCount: 0,
        };
      });
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const notifications = query.data?.notifications ?? [];
  const unreadCount = query.data?.unreadCount;

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return {
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    isError: query.isError,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    refetch: query.refetch,
  };
}
