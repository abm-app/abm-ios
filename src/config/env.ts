import logger from '@/utils/logger';

const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? '',
  STORYBOOK_ENABLED: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
};

if (!ENV.API_URL) {
  logger.warn('[env] EXPO_PUBLIC_API_URL is not set');
}

export default ENV;
