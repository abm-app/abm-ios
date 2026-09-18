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
// Concrete rather than generic over navigationRef.navigate's params — its overloaded
// signature doesn't type-check cleanly through a generic spread wrapper (confirmed by
// tsc when this was first tried), and 'AuditTrail' is the only caller today anyway.
function navigateToAuditTrailWhenReady(eventId: string | undefined): void {
  const go = () => navigationRef.navigate('AuditTrail', { eventId });

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

// Routes a tapped notification to the right in-app destination. Only `audit_event`
// (step 18) and `report_ready` (step 19) will ever need real handling here — every other
// type just opens the app, which the OS already does on tap regardless of this handler.
function handleNotificationTap(data: PushNotificationData) {
  switch (data.type) {
    case 'audit_event':
      navigateToAuditTrailWhenReady(data.linkedEntityId);
      break;
    case 'report_ready':
      // TODO: wired up in step 19 — downloads a PDF rather than navigating anywhere.
      logger.info('[useNotificationListeners] Tap handling for "report_ready" not built yet');
      break;
    default:
      break;
  }
}

// Subscribes to push notification events for the lifetime of the mounted component.
// Mount this once, near the root of the app (after NavigationContainer is available).
export function useNotificationListeners() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(() => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      handleNotificationTap(getNotificationData(response.notification));
    });

    // Cold start: the app was launched by tapping a notification, rather than a listener
    // firing while already running.
    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (response) {
          handleNotificationTap(getNotificationData(response.notification));
        }
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
