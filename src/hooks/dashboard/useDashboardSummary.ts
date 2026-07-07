import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '../../api/endpoints/dashboardApi';
import { DashboardSummary } from '../../types/dashboard';

export function useDashboardSummary() {
  return useQuery<DashboardSummary, Error>({
    queryKey: ['dashboard', 'summary'],
    queryFn: getDashboardSummary,
    staleTime: 60_000,
  });
}
