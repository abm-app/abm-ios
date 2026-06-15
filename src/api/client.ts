import axios from 'axios';

import ENV from '@/config/env';
import { getAccessToken, clearAuthTokens } from './storage';
import logger from '@/utils/logger';

const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor — attach access token ───────────────────────────────

apiClient.interceptors.request.use(async config => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — handle 401 ───────────────────────────────────────

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if (status === 401) {
      await clearAuthTokens().catch(() => {});
      logger.warn('[apiClient] 401 — tokens cleared');
    }

    return Promise.reject(error);
  },
);

export default apiClient;
