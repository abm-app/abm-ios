export type CampaignStatus = 'draft' | 'pending' | 'scheduled' | 'sent';

export type CampaignType = 'manual' | 'automated';

export interface CampaignFilters {
  tier?: string;
  property?: string;
  lapsedDays?: number;
  minPointsBalance?: number;
}

export interface Campaign {
  _id: string;
  name: string;
  templateId: string;
  type: CampaignType;
  filters: CampaignFilters;
  recipientCount: number;
  status: CampaignStatus;
  createdBy: string;
  scheduledAt: string | null;
  sentAt?: string;
}
