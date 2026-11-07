import apiClient from '../client';
import type {
  ExportReportParams,
  FlashDayResponse,
  FlashRangeResponse,
  FlashReportParams,
} from '@/types/reports';
import type { AuditProperty } from '@/types/audit';

// Flash reports use /reports/flash only. /reports/daily is deliberately not used: every call
// to it creates a report notification.

export const getFlashReportDay = (params: {
  date: string;
  property: AuditProperty;
}): Promise<FlashDayResponse> =>
  apiClient.get<FlashDayResponse>('/reports/flash', { params }).then(r => r.data);

export const getFlashReportRange = (
  params: Pick<FlashReportParams, 'from' | 'to' | 'property'>,
): Promise<FlashRangeResponse> =>
  apiClient.get<FlashRangeResponse>('/reports/flash', { params }).then(r => r.data);

export interface ExportedReport {
  bytes: ArrayBuffer;
  // From the server's Content-Disposition header; null if it could not be read.
  filename: string | null;
}

function parseFilename(header: unknown): string | null {
  if (typeof header !== 'string') return null;
  const match = /filename="?([^";]+)"?/i.exec(header);
  return match ? match[1] : null;
}

function buildExportQuery(params: ExportReportParams): Record<string, string> {
  const base = { type: params.type, format: 'pdf', property: params.property };
  if (params.type === 'daily') return { ...base, date: params.from };
  if (params.type === 'weekly') return { ...base, from: params.from, to: params.to };
  return { ...base, month: params.month };
}

// Returns raw PDF bytes, so it can't use the usual JSON `.then(r => r.data)` shape: the
// filename lives in the response headers.
export const exportReportPdf = (params: ExportReportParams): Promise<ExportedReport> =>
  apiClient
    .get<ArrayBuffer>('/reports/export', {
      params: buildExportQuery(params),
      responseType: 'arraybuffer',
    })
    .then(r => ({
      bytes: r.data,
      filename: parseFilename(r.headers['content-disposition']),
    }));
