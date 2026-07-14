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
};

export function useCampaigns() {
  return useQuery({
    queryKey: campaignKeys.list(),
    queryFn: () => fetchCampaigns(),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: [...campaignKeys.all, 'detail', id] as const,
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
    onSuccess: () => {
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
      queryClient.setQueryData([...campaignKeys.all, 'detail', variables.id], data);
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });
}

export function useEstimatedReach() {
  return useMutation({
    mutationFn: (tiers: string[]) => getEstimatedReach(tiers),
  });
}
