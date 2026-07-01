export interface RewardItem {
  id: string;
  name: string;
  cost: number;
}

export interface LoyaltyConfig {
  rewardCatalog: RewardItem[];
  tierThresholds: Record<string, number>;
  pointsPerNight: Record<string, number>;
}
