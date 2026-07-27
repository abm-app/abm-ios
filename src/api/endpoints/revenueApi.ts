import apiClient from '@/api/client';
import type { RevenueSummaryResponse, RevenueTrendsResponse, RevenuePeriod } from '@/types/revenue';
import { getCalendarDateString } from '@/utils/dateUtils';

export const getRevenueSummary = async (period: RevenuePeriod): Promise<RevenueSummaryResponse> => {
  const dateStr = getCalendarDateString(new Date());
  const dateParam = period === 'month' ? dateStr.substring(0, 7) : dateStr;

  const res = await apiClient.get<RevenueSummaryResponse>('/revenue/summary', {
    params: { period, date: dateParam },
  });
  return res.data;
};

export const getRevenueTrends = async (): Promise<RevenueTrendsResponse> => {
  const res = await apiClient.get<RevenueTrendsResponse>('/revenue/trends');
  return res.data;
};
