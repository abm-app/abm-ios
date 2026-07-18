import axios from 'axios';

import ENV from '@/config/env';
import { authStore } from '@/store/authStore';
import logger from '@/utils/logger';

const apiClient = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  timeout: 60_000,
});

// ─── Request interceptor — attach access token ───────────────────────────────

apiClient.interceptors.request.use(config => {
  const token = authStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — handle 401 ───────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response?.status;

    if ((status === 401 || status === 403 || status === 301) && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/login')
      ) {
        authStore.getState().clearSession();
        logger.warn('[apiClient] Auth endpoint failed — session cleared');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = authStore.getState().refreshToken;

      if (!refreshToken) {
        authStore.getState().clearSession();
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        axios
          .post(`${ENV.API_URL}/auth/refresh`, { refreshToken })
          .then(async ({ data }) => {
            const { accessToken: newAccess, refreshToken: newRefresh } = data;
            await authStore.getState().updateTokens(newAccess, newRefresh);

            processQueue(null, newAccess);

            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            resolve(apiClient(originalRequest));
          })
          .catch(err => {
            processQueue(err, null);
            authStore.getState().clearSession();
            logger.warn('[apiClient] Refresh failed — session cleared');
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
