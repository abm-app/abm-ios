import { isAxiosError } from 'axios';

// The backend answers failures with { "error": "<message>" }, which is safe to show.
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const message: unknown = error.response?.data?.error;
    if (typeof message === 'string' && message.length > 0) return message;
  }
  return fallback;
}
