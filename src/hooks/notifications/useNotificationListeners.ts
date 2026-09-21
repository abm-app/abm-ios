import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';

import { notificationKeys } from './useNotifications';
import { navigationRef } from '@/navigation/navigationRef';
import type { NotificationType } from '@/types/notification';
import logger from '@/utils/logger';

// Matches the `data` payload the backend sends via Expo push — see
// abm-backend/notifications/dispatch.py send_push_notifications(). `linkedEntityId` is the
// audit event's ID for `audit_event`, or the report date string for `report_ready`.
interface PushNotificationData {
  notificationId?: string;
  type?: NotificationType;
  linkedEntityId?: string;
}

function getNotificationData(notification: Notifications.Notification): PushNotificationData {
  const data = notification.request.content.data as PushNotificationData;
  return {
    notificationId: typeof data.notificationId === 'string' ? data.notificationId : undefined,
    type: typeof data.type === 'string' ? data.type : undefined,
    linkedEntityId: typeof data.linkedEntityId === 'string' ? data.linkedEntityId : undefined,
  };
}

// On a cold start (app launched by tapping a notification), this can run before
// NavigationContainer has mounted — RootNavigator holds it back behind an async session
// restore first. A `navigationRef.isReady()` check alone would silently drop the tap in
// that case, so this retries briefly rather than giving up on the first miss.
// Takes a callback rather than generic params — navigationRef.navigate's overloaded
// signature doesn't type-check cleanly through a generic spread wrapper.
function navigateWhenReady(go: () => void): void {
  if (navigationRef.isReady()) {
    go();
    return;
  }
  let attempts = 0;
  const interval = setInterval(() => {
    attempts += 1;
    if (navigationRef.isReady()) {
      clearInterval(interval);
      go();
    } else if (attempts >= 20) {
      // ~2s — session restore reading from SecureStore should never take this long.
      clearInterval(interval);
      logger.warn('[useNotificationListeners] navigationRef never became ready, dropping tap');
    }
  }, 100);
}

// Subscribes to push notification events for the lifetime of the mounted component.
// Mount this once, near the root of the app (after NavigationContainer is available).
export function useNotificationListeners() {
  const queryClient = useQueryClient();
  useEffect(() => {
    // Routes a tapped notification to the right in-app destination. Only `audit_event`
    // and `report_ready` need real handling — every other type just opens the app, which
    // the OS already does on tap regardless of this handler.
    const handleNotificationTap = (data: PushNotificationData) => {
      switch (data.type) {
        case 'audit_event':
          navigateWhenReady(() =>
            navigationRef.navigate('AuditTrail', { eventId: data.linkedEntityId }),
          );
          break;
        case 'report_ready':
          if (data.linkedEntityId) {
            const date = data.linkedEntityId;
            navigateWhenReady(() => navigationRef.navigate('ReportViewer', { date }));
          } else {
            logger.warn(
              '[useNotificationListeners] report_ready notification missing linkedEntityId (date) — cannot open',
            );
          }
          break;
        default:
          break;
      }
    };

    const receivedSubscription = Notifications.addNotificationReceivedListener(() => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      handleNotificationTap(getNotificationData(response.notification));
    });

    // Cold start: the app was launched by tapping a notification, rather than a listener
    // firing while already running. Cleared immediately after handling — expo-notifications
    // otherwise keeps returning this same response on a later call (e.g. a remount from
    // Fast Refresh, or if this effect's deps ever change again), which would replay a tap
    // that's already been handled.
    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (!response) {
          return;
        }
        handleNotificationTap(getNotificationData(response.notification));
        Notifications.clearLastNotificationResponseAsync().catch(error => {
          logger.error(
            '[useNotificationListeners] Failed to clear last notification response',
            error,
          );
        });
      })
      .catch(error => {
        logger.error('[useNotificationListeners] Failed to read last notification response', error);
      });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [queryClient]);
}
