export type CampaignStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'failed';
export type CampaignType = 'manual' | 'scheduled' | 'trigger';

export interface Campaign {
  _id: string;
  name: string;
  templateId: string;
  templateVariables: Record<string, string>;
  type: CampaignType;
  filters: Record<string, unknown>;
  recipientCount: number;
  status: CampaignStatus;
  createdBy: string;
  approvedBy?: string;
  rejectionReason?: string;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata: {
    offerExpiry?: string;
    [key: string]: unknown;
  };
}
