const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? '',
};

if (!ENV.API_URL) {
  console.warn('[env] EXPO_PUBLIC_API_URL is not set');
}

export default ENV;
