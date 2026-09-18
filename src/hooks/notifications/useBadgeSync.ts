import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import { useAuthStore } from '@/store/authStore';
import { useNotifications } from './useNotifications';
import logger from '@/utils/logger';

// Keeps the OS app-icon badge in sync with the server's actual unread count — a single
// source of truth, rather than scattering manual increment/decrement calls across receipt,
// mark-as-read, and mark-all-read, which would drift from reality over time. Mount once,
// near the root of the app (alongside useNotificationListeners).
//
// iOS: reliable, first-class OS feature. Android: best-effort — badge display depends
// entirely on the device launcher, some don't support it at all. No extra work planned to
// compensate for that; the push notification itself still delivers regardless.
export function useBadgeSync() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const { unreadCount } = useNotifications({ enabled: isAuthenticated });

  useEffect(() => {
    if (!isAuthenticated || unreadCount === undefined) {
      return;
    }
    Notifications.setBadgeCountAsync(unreadCount).catch(error => {
      logger.error('[useBadgeSync] Failed to set badge count', error);
    });
  }, [isAuthenticated, unreadCount]);
}
