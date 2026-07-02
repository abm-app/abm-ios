export interface RewardItem {
  id: string;
  name: string;
  pointsCost: number;
  type: string;
}

export interface IssuedReward {
  _id: string;
  rewardId: string;
  name: string;
  pointsCost: number;
  issuedAt: string;
  status: 'active' | 'redeemed' | 'expired';
}
