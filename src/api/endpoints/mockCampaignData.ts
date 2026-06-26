import type { Campaign } from '@/types/campaign';

export const mockCampaigns: Campaign[] = [
  {
    _id: 'cmp_1',
    name: 'Summer VIP Outreach',
    templateId: 'tpl_101',
    type: 'manual',
    filters: {
      tier: 'Platinum',
      minPointsBalance: 50000,
    },
    recipientCount: 1450,
    status: 'draft',
    createdBy: 'usr_sarah',
    scheduledAt: null,
  },
  {
    _id: 'cmp_2',
    name: 'Post-Checkout Thank You',
    templateId: 'tpl_102',
    type: 'automated',
    filters: {
      property: 'ABM Grand Hotel',
    },
    recipientCount: 0, // Automated campaigns might calculate at runtime
    status: 'pending',
    createdBy: 'usr_system',
    scheduledAt: '2026-07-01T10:00:00Z',
  },
  {
    _id: 'cmp_3',
    name: 'Lapsed Guest Re-engagement',
    templateId: 'tpl_103',
    type: 'manual',
    filters: {
      lapsedDays: 180,
    },
    recipientCount: 3200,
    status: 'scheduled',
    createdBy: 'usr_sarah',
    scheduledAt: '2026-06-30T14:30:00Z',
  },
  {
    _id: 'cmp_4',
    name: 'Gold Member Double Points',
    templateId: 'tpl_104',
    type: 'manual',
    filters: {
      tier: 'Gold',
    },
    recipientCount: 5600,
    status: 'sent',
    createdBy: 'usr_mark',
    scheduledAt: '2026-06-15T09:00:00Z',
    sentAt: '2026-06-15T09:00:05Z',
  },
  {
    _id: 'cmp_5',
    name: 'Weekend Spa Promo',
    templateId: 'tpl_105',
    type: 'manual',
    filters: {
      property: 'ABM Resort Spa',
    },
    recipientCount: 890,
    status: 'sent',
    createdBy: 'usr_jessica',
    scheduledAt: '2026-06-20T12:00:00Z',
    sentAt: '2026-06-20T12:00:02Z',
  },
];
