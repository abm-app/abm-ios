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

export const getRevenueTrends = async (monthsBack = 12): Promise<RevenueTrendsResponse> => {
  const now = new Date();
  const fromDate = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);
  const fromParam = `${fromDate.getFullYear()}-${String(fromDate.getMonth() + 1).padStart(2, '0')}`;
  const toParam = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const res = await apiClient.get<RevenueTrendsResponse>('/revenue/trends', {
    params: { from: fromParam, to: toParam },
  });
  return res.data;
};
