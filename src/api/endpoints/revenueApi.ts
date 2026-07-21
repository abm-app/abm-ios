import apiClient from '@/api/client';
import type { RevenueSummaryResponse, RevenueTrendsResponse, RevenuePeriod } from '@/types/revenue';

export const getRevenueSummary = async (period: RevenuePeriod): Promise<RevenueSummaryResponse> => {
  const res = await apiClient.get<RevenueSummaryResponse>('/revenue/summary', {
    params: { period },
  });
  return res.data;
};

export const getRevenueTrends = async (): Promise<RevenueTrendsResponse> => {
  const res = await apiClient.get<RevenueTrendsResponse>('/revenue/trends');
  return res.data;
};
