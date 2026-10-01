import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { registerPushToken } from '@/api/endpoints/authApi';
import logger from '@/utils/logger';

function safeErrorDetails(error: unknown) {
  return {
    message: error instanceof Error ? error.message : String(error),
    status: isAxiosError(error) ? error.response?.status : undefined,
  };
}

async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) {
    logger.warn('[usePushRegistration] Push notifications require a physical device', {
      platform: Platform.OS,
    });
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  logger.info('[usePushRegistration] Current permission status', {
    status: existingStatus,
    platform: Platform.OS,
  });
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    logger.info('[usePushRegistration] Requested permissions', {
      status,
      platform: Platform.OS,
    });
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    logger.warn('[usePushRegistration] Push permission not granted', {
      status: finalStatus,
      platform: Platform.OS,
    });
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    logger.warn('[usePushRegistration] Missing EAS projectId — cannot get push token', {
      platform: Platform.OS,
    });
    return null;
  }

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    logger.info('[usePushRegistration] Successfully obtained push token', {
      tokenLength: token.length,
      platform: Platform.OS,
    });
    return token;
  } catch (error) {
    logger.error('[usePushRegistration] Failed to get push token', error, {
      platform: Platform.OS,
    });
    throw error;
  }
}

// Best-effort: requests permission, obtains an Expo push token, and registers it with the
// backend. Call after a successful login (session must already be set — the endpoint
// requires a valid JWT). Failure here should never block or fail the login flow itself.
export function usePushRegistration() {
  return useMutation({
    mutationFn: async (): Promise<string | null> => {
      logger.info('[usePushRegistration] Starting push token registration', {
        platform: Platform.OS,
      });
      const token = await getExpoPushToken();
      if (!token) {
        logger.warn('[usePushRegistration] No token obtained', {
          platform: Platform.OS,
        });
        return null;
      }
      try {
        await registerPushToken(token);
        logger.info('[usePushRegistration] Successfully registered push token', {
          platform: Platform.OS,
        });
        return token;
      } catch (error) {
        logger.error(
          '[usePushRegistration] Failed to register token with backend',
          safeErrorDetails(error),
          {
            platform: Platform.OS,
          },
        );
        throw error;
      }
    },
    onError: error => {
      logger.error('[usePushRegistration] Push registration failed', safeErrorDetails(error), {
        platform: Platform.OS,
      });
    },
  });
}
