import { useQuery } from '@tanstack/react-query';
import { getRevenueSummary, getRevenueTrends } from '@/api/endpoints/revenueApi';
import type { RevenuePeriod } from '@/types/revenue';

export function useRevenueSummary(period: RevenuePeriod) {
  return useQuery({
    queryKey: ['revenueSummary', period],
    queryFn: () => getRevenueSummary(period),
  });
}

export function useRevenueTrends() {
  return useQuery({
    queryKey: ['revenueTrends'],
    queryFn: getRevenueTrends,
  });
}
