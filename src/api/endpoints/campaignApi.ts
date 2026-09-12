import type {
  Campaign,
  MetaTemplate,
  VariableConfig,
  Trigger,
  SendWindow,
  AutomationRun,
} from '@/types/campaign';
import apiClient from '../client';

export interface CreateCampaignPayload {
  name: string;
  templateId: string;
  templateVariables?: Record<string, string>;
  variableConfigs?: Record<string, VariableConfig>;
  type: 'manual' | 'scheduled' | 'trigger';
  filters: Record<string, unknown>;
  recipientCount: number;
  trigger?: Trigger;
  priority?: number;
  sendWindow?: SendWindow | null;
  status?: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'active' | 'paused';
  scheduledAt?: string;
  rejectionReason?: string;
  offerExpiry?: string;
  metadata?: {
    [key: string]: unknown;
  };
}

export interface FetchCampaignsParams {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface FetchCampaignsResponse {
  campaigns: Campaign[];
  total: number;
  page: number;
  limit: number;
}

export const fetchCampaigns = async (
  params?: FetchCampaignsParams,
): Promise<FetchCampaignsResponse> => {
  const response = await apiClient.get<FetchCampaignsResponse>('/campaigns/', { params });
  return response.data;
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

export interface GetAutomationRunsResponse {
  runs: AutomationRun[];
  total: number;
  page: number;
  limit: number;
}

export const getAutomationRuns = async (
  campaignId: string,
  page: number,
  limit: number,
): Promise<GetAutomationRunsResponse> => {
  const response = await apiClient.get<GetAutomationRunsResponse>(`/campaigns/${campaignId}/runs`, {
    params: { page, limit },
  });
  return response.data;
};
