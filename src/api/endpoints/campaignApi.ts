import type { Campaign } from '@/types/campaign';
import apiClient from '../client';

export interface CreateCampaignPayload {
  name: string;
  templateId: string;
  templateVariables?: Record<string, string>;
  type: 'manual' | 'scheduled' | 'trigger';
  filters: Record<string, unknown>;
  recipientCount: number;
  scheduledAt?: string;
  offerExpiry?: string;
  metadata?: {
    [key: string]: unknown;
  };
}

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const response = await apiClient.get<{ campaigns: Campaign[] }>('/api/campaigns/');
  return response.data.campaigns;
};

export const fetchCampaignById = async (id: string): Promise<Campaign> => {
  const response = await apiClient.get<Campaign>(`/api/campaigns/${id}/`);
  const data = response.data;

  return data;
};

export const createCampaign = async (payload: CreateCampaignPayload): Promise<Campaign> => {
  const response = await apiClient.post<Campaign>('/api/campaigns/create', payload);
  return response.data;
};

export const updateCampaign = async (
  id: string,
  payload: Partial<CreateCampaignPayload>,
): Promise<Campaign> => {
  const response = await apiClient.patch<Campaign>(`/api/campaigns/${id}/update`, payload);
  return response.data;
};

export const deleteCampaign = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/api/campaigns/${id}/delete`);
  return { message: response.data?.message || 'Campaign deleted successfully.' };
};

export const getEstimatedReach = async (tiers: string[]): Promise<number> => {
  if (tiers.length === 0) {
    return 0;
  }
  const tiersString = tiers.join(',');
  const response = await apiClient.get<{ count: number }>('/api/campaigns/reach', {
    params: { tiers: tiersString },
  });
  return response.data.count;
};

// No live templates endpoint — using static list until backend provides one.
export const fetchMetaTemplates = async (): Promise<import('@/types/campaign').MetaTemplate[]> => {
  return [
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
  ];
};
