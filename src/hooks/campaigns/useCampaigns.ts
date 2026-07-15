import { useQuery } from '@tanstack/react-query';
import {
  fetchCampaigns,
  fetchCampaignById,
  fetchMetaTemplates,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getEstimatedReach,
} from '@/api/endpoints/campaignApi';

export const campaignKeys = {
  all: ['campaigns'] as const,
  list: () => [...campaignKeys.all, 'list'] as const,
  detail: (id: string) => [...campaignKeys.all, 'detail', id] as const,
};

export function useCampaigns() {
  return useQuery({
    queryKey: campaignKeys.list(),
    queryFn: () => fetchCampaigns(),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: campaignKeys.detail(id),
    queryFn: () => fetchCampaignById(id),
    enabled: !!id,
  });
}

export function useMetaTemplates() {
  return useQuery({
    queryKey: [...campaignKeys.all, 'templates'] as const,
    queryFn: () => fetchMetaTemplates(),
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateCampaignPayload } from '@/api/endpoints/campaignApi';

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => createCampaign(payload),
    onSuccess: data => {
      queryClient.setQueryData(campaignKeys.detail(data._id), data);
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateCampaignPayload> }) =>
      updateCampaign(id, payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(campaignKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: campaignKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });
}

export function useEstimatedReach() {
  return useMutation({
    mutationFn: (tiers: string[]) => getEstimatedReach(tiers),
  });
}
