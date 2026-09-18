import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';

import { notificationKeys } from './useNotifications';
import type { NotificationType } from '@/types/notification';
import logger from '@/utils/logger';

// Matches the `data` payload the backend sends via Expo push — see
// abm-backend/notifications/dispatch.py send_push_notifications(). Only `notificationId`
// and `type` are sent today; there is no `linkedEntityId`, so per-type tap destinations
// (audit_event -> event route, report_ready -> PDF download) can't fully resolve *which*
// entity to act on yet. Flagged for whoever builds those (steps 18/19) — either the
// backend payload needs to start including it, or it has to be looked up client-side via
// notificationId after the fact.
interface PushNotificationData {
  notificationId?: string;
  type?: NotificationType;
}

function getNotificationData(notification: Notifications.Notification): PushNotificationData {
  const data = notification.request.content.data as PushNotificationData;
  return {
    notificationId: typeof data.notificationId === 'string' ? data.notificationId : undefined,
    type: typeof data.type === 'string' ? data.type : undefined,
  };
}

// Routes a tapped notification to the right in-app destination. Only `audit_event`
// (step 18) and `report_ready` (step 19) will ever need real handling here — every other
// type just opens the app, which the OS already does on tap regardless of this handler.
function handleNotificationTap(data: PushNotificationData) {
  switch (data.type) {
    case 'audit_event':
    case 'report_ready':
      // TODO: wired up in steps 18/19 respectively.
      logger.info(`[useNotificationListeners] Tap handling for "${data.type}" not built yet`);
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
