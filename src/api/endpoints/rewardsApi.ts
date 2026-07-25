import type { RewardItem, IssuedReward } from '@/types/reward';

import apiClient from '../client';

export const getGuestRewardCatalogue = (guestId: string): Promise<RewardItem[]> =>
  apiClient.get(`/loyalty/redemptions/catalog/${guestId}/`).then(r => r.data.catalog);

export const getGuestRewards = (guestId: string): Promise<IssuedReward[]> =>
  apiClient.get(`/loyalty/redemptions/guest/${guestId}/`).then(r => r.data.redemptions);

export const issueGuestReward = (guestId: string, rewardId: string): Promise<void> =>
  apiClient.post('/loyalty/redemptions/redeem/', { guestId, rewardId }).then(r => r.data);
