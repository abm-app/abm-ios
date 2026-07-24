// src/types/loyalty.ts

export interface TierThreshold {
  name: string;
  minPoints: number;
}

export interface RewardCatalogItem {
  id?: string;
  name: string;
  cost: number;
}

export interface LoyaltyConfig {
  rewardCatalog: RewardCatalogItem[];
  tierThresholds: TierThreshold[];
  pointsPerNight: Record<string, number>;
}

export interface UpdateLoyaltyConfigPayload {
  rewardCatalog?: RewardCatalogItem[];
  tierThresholds?: TierThreshold[];
}
