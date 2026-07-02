import logger from '@/utils/logger';

const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? '',
  DEV_MODE_ENABLED: false,
};

export const USE_MOCK_AUTH = true;

if (!ENV.API_URL) {
  logger.warn('[env] EXPO_PUBLIC_API_URL is not set');
}

export default ENV;
