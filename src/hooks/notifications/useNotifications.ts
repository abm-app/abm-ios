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

interface UseNotificationsOptions {
  // Lets a consumer that mounts regardless of auth state (e.g. badge syncing) opt out of
  // fetching until the user is actually logged in. Defaults to true — every existing call
  // site is already behind the authenticated stack, so this stays a no-op for them.
  enabled?: boolean;
}

export function useNotifications({ enabled = true }: UseNotificationsOptions = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: notificationKeys.all,
    queryFn: getNotifications,
    retry: false,
    enabled,
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
