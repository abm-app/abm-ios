import { useQuery } from '@tanstack/react-query';
import { getRewardCatalogue } from '@/api/endpoints/rewardsApi';

export const rewardsKeys = {
  all: ['rewards'] as const,
  catalogue: () => [...rewardsKeys.all, 'catalogue'] as const,
};

export function useRewardCatalogue() {
  return useQuery({
    queryKey: rewardsKeys.catalogue(),
    queryFn: getRewardCatalogue,
  });
}
