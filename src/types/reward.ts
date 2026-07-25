export interface RewardItem {
  id: string;
  name: string;
  pointsCost: number;
  type?: string;
  canAfford?: boolean;
}

export interface IssuedReward {
  id: string;
  rewardId: string;
  rewardName: string;
  pointsCost: number;
  redeemedById: string;
  redeemedByName: string;
  redeemedAt: string;
}
