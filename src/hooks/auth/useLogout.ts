import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';

import { logout as logoutApi } from '@/api/endpoints/authApi';
import { useAuthStore } from '@/store/authStore';
import { notificationKeys } from '@/hooks/notifications/useNotifications';
import logger from '@/utils/logger';

export function useLogout() {
  const clearSession = useAuthStore(s => s.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSettled: () => {
      clearSession();
      // useBadgeSync stops updating once isAuthenticated flips false (its query gets
      // disabled), but that just stops future syncing — it doesn't clear whatever count
      // was last set, so this has to happen explicitly.
      Notifications.setBadgeCountAsync(0).catch(error => {
        logger.error('[useLogout] Failed to clear badge count', error);
      });
      // notificationKeys.all is a single global cache key, not scoped per user — disabling
      // the query on logout stops new fetches but leaves the previous user's cached
      // notifications/unreadCount sitting there. Without this, a different account logging
      // in on the same device (same QueryClient instance, no app restart) could briefly see
      // the prior account's stale notification data until its own fetch completes.
      queryClient.removeQueries({ queryKey: notificationKeys.all });
    },
  });
}
