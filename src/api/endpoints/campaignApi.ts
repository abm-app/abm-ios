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

export const fetchCampaignById = async (id: string): Promise<Campaign> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const campaign = mockCampaigns.find(c => c._id === id);
      if (campaign) {
        resolve(campaign);
      } else {
        reject(new Error('Campaign not found'));
      }
    }, 800);
  });
};

/**
 * Mock implementation for creating a campaign.
 */
export const createCampaign = async (
  payload: CreateCampaignPayload,
): Promise<{ success: boolean; data: Campaign }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newCampaign: Campaign = {
        _id: `camp_${Math.random().toString(36).substring(7)}`,
        name: payload.name,
        type: payload.type,
        status: 'pending_approval',
        templateId: payload.templateId,
        templateVariables: payload.templateVariables,
        filters: payload.filters,
        recipientCount: payload.recipientCount,
        scheduledAt: payload.scheduledAt,
        offerExpiry: payload.offerExpiry,
        metadata: payload.metadata,
        createdBy: 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mutate the mock array in-memory so it shows up in the dashboard
      mockCampaigns.unshift(newCampaign);

      console.log('Mock API: created campaign', newCampaign._id);
      resolve({ success: true, data: newCampaign });
    }, 800);
  });
};

export const updateCampaign = async (
  id: string,
  payload: Partial<CreateCampaignPayload>,
): Promise<{ success: boolean; data: Campaign }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const idx = mockCampaigns.findIndex(c => c._id === id);
      if (idx === -1) {
        reject(new Error('Campaign not found'));
        return;
      }
      const updatedCampaign = {
        ...mockCampaigns[idx],
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      // Mutate the mock array
      mockCampaigns[idx] = updatedCampaign;

      console.log('Mock API: updated campaign', id);
      resolve({ success: true, data: updatedCampaign });
    }, 800);
  });
};

export const deleteCampaign = async (id: string): Promise<{ success: boolean }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const idx = mockCampaigns.findIndex(c => c._id === id);
      if (idx === -1) {
        reject(new Error('Campaign not found'));
        return;
      }

      // Remove from mock array
      mockCampaigns.splice(idx, 1);

      console.log('Mock API: deleted campaign', id);
      resolve({ success: true });
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
        {
          id: 'tpl_monsoon',
          label: 'Monsoon Flash Sale',
          vars: ['Guest_Name'],
          body: 'Hi {{Guest_Name}}, the Monsoons are here! Enjoy an exclusive 20% off your next stay at Lamax Properties. Valid for 48 hours.',
        },
        {
          id: 'tpl_weekend',
          label: 'Weekend Upgrade',
          vars: [],
          body: 'Dear Guest, upgrade your weekend stay to a suite for just $50 more! Reply YES to claim this exclusive offer.',
        },
      ]);
    }, 600);
  });
};
