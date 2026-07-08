import { useQuery } from '@tanstack/react-query';
import { getStatusOverview } from '@/api/endpoints/statusApi';

export const statusOverviewKeys = {
  all: ['status', 'overview'] as const,
};

export function useStatusOverview() {
  return useQuery({
    queryKey: statusOverviewKeys.all,
    queryFn: getStatusOverview,
  });
}
