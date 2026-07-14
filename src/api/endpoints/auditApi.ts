import apiClient from '@/api/client';

import type { AuditEventsResponse, GetAuditEventsParams } from '@/types/audit';

export const getAuditEvents = async (
  params: GetAuditEventsParams,
): Promise<AuditEventsResponse> => {
  const { page, limit, filters } = params;

  const queryParams: Record<string, string | number> = { page, limit };

  if (filters?.property && filters.property.length > 0) {
    queryParams.property = filters.property.join(',');
  }
  if (filters?.eventType && filters.eventType.length > 0) {
    queryParams.eventType = filters.eventType.join(',');
  }
  if (filters?.rmCode && filters.rmCode.length > 0) {
    queryParams.rmCode = filters.rmCode.join(',');
  }
  if (filters?.from) {
    queryParams.from = filters.from;
  }
  if (filters?.to) {
    queryParams.to = filters.to;
  }

  const res = await apiClient.get<AuditEventsResponse>('/audit/events', { params: queryParams });
  return res.data;
};
