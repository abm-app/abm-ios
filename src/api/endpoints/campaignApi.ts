import type { Campaign } from '@/types/campaign';
import { mockCampaigns } from './mockCampaignData';

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
