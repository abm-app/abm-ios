import logger from '@/utils/logger';

const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? '',
  STORYBOOK_ENABLED: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
  DEV_MODE_ENABLED: process.env.EXPO_PUBLIC_DEV_MODE === 'true',
};

export const USE_MOCK_AUTH = process.env.EXPO_PUBLIC_USE_MOCK_AUTH === 'true';

if (!ENV.API_URL) {
  logger.warn('[env] EXPO_PUBLIC_API_URL is not set');
}

export default ENV;
