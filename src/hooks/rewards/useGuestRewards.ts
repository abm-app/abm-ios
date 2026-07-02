import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGuestRewards, issueGuestReward } from '@/api/endpoints/rewardsApi';
import { guestsKeys } from '@/hooks/guests/useGuests';

export const guestRewardsKeys = {
  all: ['guestRewards'] as const,
  list: (guestId: string) => [...guestRewardsKeys.all, guestId] as const,
};

export function useGuestRewards(guestId: string) {
  return useQuery({
    queryKey: guestRewardsKeys.list(guestId),
    queryFn: () => getGuestRewards(guestId),
  });
}

export function useIssueGuestReward(guestId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rewardId: string) => issueGuestReward(guestId, rewardId),
    onSuccess: () => {
      // Refresh the rewards list
      queryClient.invalidateQueries({ queryKey: guestRewardsKeys.list(guestId) });
      // Refresh the guest details and all guest lists (so the spendableBalance updates globally)
      queryClient.invalidateQueries({ queryKey: guestsKeys.all });
    },
  });
}
