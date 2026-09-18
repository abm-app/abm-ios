import { useMutation } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';

import { logout as logoutApi } from '@/api/endpoints/authApi';
import { useAuthStore } from '@/store/authStore';
import logger from '@/utils/logger';

export function useLogout() {
  const clearSession = useAuthStore(s => s.clearSession);

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
    },
  });
}
