import type { LoyaltyConfig } from '@/types/loyalty';

const mockLoyaltyConfig: LoyaltyConfig = {
  rewardCatalog: [
    { id: 'room_upgrade', name: 'Room Upgrade', cost: 2000 },
    { id: 'late_checkout', name: 'Late Checkout', cost: 2000 },
    { id: 'discount', name: 'Next-Stay Discount', cost: 2000 },
    { id: 'complimentary_meal', name: 'Complimentary Meal', cost: 2000 },
  ],
  tierThresholds: {
    bronze: 50,
    silver: 100,
    gold: 200,
  },
  pointsPerNight: {
    Standard: 50,
    Deluxe: 100,
    Suite: 200,
  },
};

// import apiClient from '../client';
//
// When the real endpoint is ready, use apiClient like this:
// export const getLoyaltyConfig = (): Promise<LoyaltyConfig> =>
//   apiClient.get('/loyalty/config').then((r) => r.data);

export const getLoyaltyConfig = async (): Promise<LoyaltyConfig> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLoyaltyConfig;
};
