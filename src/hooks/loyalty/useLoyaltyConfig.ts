import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLoyaltyConfig, updateLoyaltyConfig } from '@/api/endpoints/loyaltyApi';
import type { UpdateLoyaltyConfigPayload } from '@/types/loyalty';

export const loyaltyKeys = {
  all: ['loyalty'] as const,
  config: () => [...loyaltyKeys.all, 'config'] as const,
};

export function useLoyaltyConfig() {
  return useQuery({
    queryKey: loyaltyKeys.config(),
    queryFn: getLoyaltyConfig,
  });
}

export function useUpdateLoyaltyConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateLoyaltyConfigPayload) => updateLoyaltyConfig(payload),
    onSuccess: updatedConfig => {
      queryClient.setQueryData(loyaltyKeys.config(), updatedConfig);
    },
  });
}
