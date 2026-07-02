import type { RewardItem } from '@/types/reward';

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

export const getRewardCatalogue = async (): Promise<RewardItem[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockRewardCatalogue;
};
