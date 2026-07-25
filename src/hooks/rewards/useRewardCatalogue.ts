import { useQuery } from '@tanstack/react-query';
import { getGuestRewardCatalogue } from '@/api/endpoints/rewardsApi';

export const rewardsKeys = {
  all: ['rewards'] as const,
  catalogue: (guestId: string) => [...rewardsKeys.all, 'catalogue', guestId] as const,
};

export function useGuestRewardCatalogue(guestId: string) {
  return useQuery({
    queryKey: rewardsKeys.catalogue(guestId),
    queryFn: () => getGuestRewardCatalogue(guestId),
  });
}
