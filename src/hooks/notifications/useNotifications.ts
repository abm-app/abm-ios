import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/api/endpoints/notificationsApi';
import type { AppNotification } from '@/types/notification';

export const notificationKeys = {
  all: ['notifications'] as const,
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Early Checkout Alert',
    description: 'Room 101 (R. Kumar) checked out 2 days early.',
    timestamp: '2m ago',
    read: false,
    icon: 'alert-triangle',
  },
  {
    id: '2',
    type: 'upgrade',
    title: 'Tier Upgrade',
    description: 'Sarah Jenkins reached Suite Tier.',
    timestamp: '15m ago',
    read: false,
    icon: 'star',
  },
  {
    id: '3',
    type: 'campaign',
    title: 'Campaign Approved',
    description: 'Monsoon Flash Sale was approved.',
    timestamp: '1h ago',
    read: true,
    icon: 'volume-2',
  },
  {
    id: '4',
    type: 'summary',
    title: 'Daily Summary Ready',
    description: 'The financial report for Oct 24 is available.',
    timestamp: 'Yesterday',
    read: true,
    icon: 'file-text',
  },
];

export function useNotifications() {
  const queryClient = useQueryClient();
  const [localNotifications, setLocalNotifications] =
    useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  const query = useQuery({
    queryKey: notificationKeys.all,
    queryFn: getNotifications,
    retry: false,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const notifications = query.data?.notifications ?? localNotifications;
  const unreadCount = query.data?.unreadCount ?? notifications.filter(n => !n.read).length;

  const handleMarkAsRead = useCallback(
    (id: string) => {
      setLocalNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
      markAsReadMutation.mutate(id);
    },
    [markAsReadMutation],
  );

  const handleMarkAllAsRead = useCallback(() => {
    setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

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
