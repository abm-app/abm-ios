import type { Campaign } from '@/types/campaign';
import { mockCampaigns } from './mockCampaignData';

export interface CreateCampaignPayload {
  name: string;
  templateId: string;
  templateVariables: Record<string, string>;
  type: 'manual' | 'scheduled' | 'trigger';
  filters: Record<string, unknown>;
  recipientCount: number;
  scheduledAt?: string;
  offerExpiry?: string;
  metadata: {
    [key: string]: unknown;
  };
}

/**
 * Mock implementation of fetchCampaigns for Week 3 UI development.
 * Simulates network latency. In Week 4, this will be swapped for real axios calls.
 */
export const fetchCampaigns = async (): Promise<Campaign[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockCampaigns);
    }, 800);
  });
};

/**
 * Mock implementation for creating a campaign.
 */
export const createCampaign = async (
  payload: CreateCampaignPayload,
): Promise<{ success: boolean; data: unknown }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Mock API: createCampaign payload:', payload);
      resolve({ success: true, data: payload });
    }, 800);
  });
};

/**
 * Calculates the estimated reach (guest count) based on selected tier filters.
 */
export const getEstimatedReach = async (tiers: string[]): Promise<number> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (tiers.length === 0) resolve(0);
      else if (tiers.includes('All') || tiers.length === 4) resolve(34250);
      else resolve(tiers.length * 8420);
    }, 600);
  });
};

/**
 * Fetches available Meta templates.
 */
export const fetchMetaTemplates = async (): Promise<import('@/types/campaign').MetaTemplate[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 'tpl_monsoon', label: 'Monsoon Flash Sale', vars: ['Guest_Name'] },
        { id: 'tpl_weekend', label: 'Weekend Upgrade', vars: [] },
      ]);
    }, 600);
  });
};
