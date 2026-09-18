import { useMutation } from '@tanstack/react-query';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { registerPushToken } from '@/api/endpoints/authApi';
import logger from '@/utils/logger';

async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) {
    logger.warn('[usePushRegistration] Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    logger.warn('[usePushRegistration] Push permission not granted');
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    logger.warn('[usePushRegistration] Missing EAS projectId — cannot get push token');
    return null;
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  return token;
}

// Best-effort: requests permission, obtains an Expo push token, and registers it with the
// backend. Call after a successful login (session must already be set — the endpoint
// requires a valid JWT). Failure here should never block or fail the login flow itself.
export function usePushRegistration() {
  return useMutation({
    mutationFn: async (): Promise<string | null> => {
      const token = await getExpoPushToken();
      if (!token) {
        return null;
      }
      await registerPushToken(token);
      return token;
    },
    onError: error => {
      logger.error('[usePushRegistration] Failed to register push token', error);
    },
  });
}
