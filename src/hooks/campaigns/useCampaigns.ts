import { useQuery } from '@tanstack/react-query';
import { fetchCampaigns } from '@/api/endpoints/campaignApi';

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

export function useMetaTemplates() {
  return useQuery({
    queryKey: [...campaignKeys.all, 'templates'] as const,
    queryFn: () => import('@/api/endpoints/campaignApi').then(m => m.fetchMetaTemplates()),
  });
}
