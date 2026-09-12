import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchCampaigns,
  fetchCampaignById,
  fetchMetaTemplates,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getEstimatedReach,
  getAutomationRuns,
  type FetchCampaignsParams,
} from '@/api/endpoints/campaignApi';

export const campaignKeys = {
  all: ['campaigns'] as const,
  list: () => [...campaignKeys.all, 'list'] as const,
  detail: (id: string) => [...campaignKeys.all, 'detail', id] as const,
  automations: (params?: FetchCampaignsParams) =>
    [...campaignKeys.all, 'automations', params ?? {}] as const,
  automationRuns: (campaignId: string, page: number, limit: number) =>
    [...campaignKeys.all, 'automations', campaignId, 'runs', page, limit] as const,
};

export function useCampaigns() {
  return useQuery({
    queryKey: campaignKeys.list(),
    queryFn: async () => (await fetchCampaigns()).campaigns,
  });
}

export function useInfiniteAutomations(
  params?: Omit<FetchCampaignsParams, 'type' | 'page'>,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: campaignKeys.automations(params),
    queryFn: ({ pageParam = 1 }) => fetchCampaigns({ ...params, type: 'trigger', page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const { page, limit, total } = lastPage;
      return page * limit < total ? page + 1 : undefined;
    },
    enabled,
  });
}

export function useAutomationRuns(campaignId: string, page: number, limit: number) {
  return useQuery({
    queryKey: campaignKeys.automationRuns(campaignId, page, limit),
    queryFn: () => getAutomationRuns(campaignId, page, limit),
    enabled: !!campaignId,
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
    staleTime: 0,
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
