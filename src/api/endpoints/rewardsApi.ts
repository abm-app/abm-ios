import type { RewardItem, IssuedReward } from '@/types/reward';

import apiClient from '../client';

interface ApiCatalogItem {
  id: string;
  name: string;
  cost: number;
  canAfford?: boolean;
}

export const getGuestRewardCatalogue = (guestId: string): Promise<RewardItem[]> =>
  apiClient.get(`/loyalty/redemptions/catalog/${guestId}/`).then(r =>
    r.data.catalog.map((item: ApiCatalogItem) => ({
      id: item.id,
      name: item.name,
      pointsCost: item.cost,
      canAfford: item.canAfford,
    })),
  );

export const getGuestRewards = (guestId: string): Promise<IssuedReward[]> =>
  apiClient.get(`/loyalty/redemptions/guest/${guestId}/`).then(r => r.data.redemptions);

export const issueGuestReward = (guestId: string, rewardId: string): Promise<void> =>
  apiClient.post('/loyalty/redemptions/redeem/', { guestId, rewardId }).then(r => r.data);
