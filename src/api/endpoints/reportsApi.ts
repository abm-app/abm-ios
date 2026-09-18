import apiClient from '../client';
import type { UserProperty } from '@/types/auth';

export interface GetDailyReportPdfParams {
  date: string;
  // Only 'express'/'international' are valid backend query values. A 'both'-scoped user
  // omits this entirely to get combined data — matches the backend's own default when no
  // `property` filter is given (see reports/views.py _resolve_properties()).
  property?: Extract<UserProperty, 'express' | 'international'>;
}

// GET /reports/export returns raw PDF bytes with a Content-Disposition header, not JSON —
// responseType: 'arraybuffer' is required, this can't go through the usual JSON-shaped
// endpoint pattern.
export const getDailyReportPdf = (params: GetDailyReportPdfParams): Promise<ArrayBuffer> =>
  apiClient
    .get<ArrayBuffer>('/reports/export', {
      params: {
        type: 'daily',
        format: 'pdf',
        date: params.date,
        ...(params.property ? { property: params.property } : {}),
      },
      responseType: 'arraybuffer',
    })
    .then(r => r.data);
