import { useQuery } from '@tanstack/react-query';
import { getLoyaltyConfig } from '@/api/endpoints/loyaltyApi';

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
