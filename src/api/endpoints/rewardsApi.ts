import type { RewardItem, IssuedReward } from '@/types/reward';
import { deductGuestPoints } from './mockGuestData';

export const mockRewardCatalogue: RewardItem[] = [
  { id: 'cat_001', name: 'Late Checkout (2 PM)', pointsCost: 1000, type: 'late_checkout' },
  { id: 'cat_002', name: 'Complimentary Meal', pointsCost: 2000, type: 'complimentary_meal' },
  { id: 'cat_003', name: 'Room Upgrade', pointsCost: 5000, type: 'room_upgrade' },
  { id: 'cat_004', name: 'Next-Stay Discount (10%)', pointsCost: 10000, type: 'discount' },
];

// import apiClient from '../client';
//
// export const getRewardCatalogue = (): Promise<RewardItem[]> =>
//   apiClient.get('/rewards/catalogue').then((r) => r.data);

// import apiClient from '../client';

export const getRewardCatalogue = async (): Promise<RewardItem[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockRewardCatalogue;
};

// In-memory mock state for guest rewards
const mockGuestRewards: Record<string, IssuedReward[]> = {};

export const getGuestRewards = async (guestId: string): Promise<IssuedReward[]> => {
  // export const getGuestRewards = (guestId: string): Promise<IssuedReward[]> =>
  //   apiClient.get(`/guests/${guestId}/rewards`).then(r => r.data);

  await new Promise(resolve => setTimeout(resolve, 300));
  return mockGuestRewards[guestId] || [];
};

export const issueGuestReward = async (
  guestId: string,
  rewardId: string,
): Promise<IssuedReward> => {
  // export const issueGuestReward = (guestId: string, rewardId: string): Promise<IssuedReward> =>
  //   apiClient.post(`/guests/${guestId}/rewards`, { rewardId }).then(r => r.data);

  await new Promise(resolve => setTimeout(resolve, 500));

  const catalogItem = mockRewardCatalogue.find(r => r.id === rewardId);
  if (!catalogItem) throw new Error('Reward not found');

  const newReward: IssuedReward = {
    _id: `rew_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    rewardId: catalogItem.id,
    name: catalogItem.name,
    pointsCost: catalogItem.pointsCost,
    issuedAt: new Date().toISOString(),
    status: 'active',
  };

  if (!mockGuestRewards[guestId]) {
    mockGuestRewards[guestId] = [];
  }

  mockGuestRewards[guestId].unshift(newReward);
  await deductGuestPoints(guestId, catalogItem.pointsCost);

  return newReward;
};
