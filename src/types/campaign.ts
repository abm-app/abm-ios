export type CampaignStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'active'
  | 'paused'
  | 'rejected'
  | 'sent'
  | 'failed';
export type CampaignType = 'manual' | 'scheduled' | 'trigger';

export type TriggerType = 'post_checkout' | 'days_since_visit' | 'tier_upgrade';

export interface Trigger {
  type: TriggerType;
  days?: number;
}

export type WeekdayCode = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface SendWindow {
  startHour: number;
  endHour: number;
  days: WeekdayCode[];
}

export interface AutomationStats {
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  total: number;
}

export interface AutomationRun {
  id: string;
  campaignId: string;
  triggerType: TriggerType;
  startedAt: string;
  finishedAt: string;
  matched: number;
  enqueued: number;
  skipped: number;
  error: string | null;
}

export interface VariableConfig {
  source: 'guest_field' | 'custom';
  guestField?: string;
  customValue?: string;
}

export interface Campaign {
  _id: string;
  name: string;
  templateId: string;
  templateVariables?: Record<string, string>;
  variableConfigs?: Record<string, VariableConfig>;
  type: CampaignType;
  filters: Record<string, unknown>;
  // Required for broadcasts, absent on trigger (automation) campaigns.
  recipientCount?: number;
  status: CampaignStatus;
  trigger?: Trigger;
  priority?: number;
  sendWindow?: SendWindow | null;
  activatedAt?: string | null;
  lastTriggeredAt?: string | null;
  stats?: AutomationStats;
  createdBy: { id: string; name: string };
  approvedBy?: { id: string; name: string };
  rejectionReason?: string;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt?: string;
  offerExpiry?: string;
  metadata?: {
    [key: string]: unknown;
  };
}

export interface MetaTemplateVariable {
  key: string;
  label: string;
  isCustomerName: boolean;
}

export interface MetaTemplate {
  id: string;
  name: string;
  body: string;
  variables: MetaTemplateVariable[];
}
