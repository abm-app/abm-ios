import type { Campaign, MetaTemplate } from '@/types/campaign';
import apiClient from '../client';

interface VariableConfig {
  source: 'guest_field' | 'custom';
  guestField?: string;
  customValue?: string;
}

export interface CreateCampaignPayload {
  name: string;
  templateId: string;
  templateVariables?: Record<string, string>;
  variableConfigs?: Record<string, VariableConfig>;
  type: 'manual' | 'scheduled' | 'trigger';
  filters: Record<string, unknown>;
  recipientCount: number;
  status?: 'draft' | 'pending_approval';
  scheduledAt?: string;
  offerExpiry?: string;
  metadata?: {
    [key: string]: unknown;
  };
}

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const response = await apiClient.get<{ campaigns: Campaign[] }>('/campaigns/');
  return response.data.campaigns;
};

export const fetchCampaignById = async (id: string): Promise<Campaign> => {
  const response = await apiClient.get<Campaign>(`/campaigns/${id}/`);
  const data = response.data;

  return data;
};

export const createCampaign = async (payload: CreateCampaignPayload): Promise<Campaign> => {
  const response = await apiClient.post<Campaign>('/campaigns/create', payload);
  return response.data;
};

export const updateCampaign = async (
  id: string,
  payload: Partial<CreateCampaignPayload>,
): Promise<Campaign> => {
  const response = await apiClient.patch<Campaign>(`/campaigns/${id}/update`, payload);
  return response.data;
};

export const deleteCampaign = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/campaigns/${id}/delete`);
  return { message: response.data?.message || 'Campaign deleted successfully.' };
};

export const getEstimatedReach = async (tiers: string[]): Promise<number> => {
  if (tiers.length === 0) {
    return 0;
  }
  const tiersString = tiers.join(',');
  const response = await apiClient.get<{ count: number }>('/campaigns/reach', {
    params: { tiers: tiersString },
  });
  return response.data.count;
};

export const fetchMetaTemplates = async (): Promise<MetaTemplate[]> => {
  const response = await apiClient.get<{ templates: MetaTemplate[] }>('/campaigns/templates/');
  return response.data.templates;
};
