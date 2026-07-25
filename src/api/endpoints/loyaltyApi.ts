import apiClient from '../client';
import type { LoyaltyConfig, UpdateLoyaltyConfigPayload } from '@/types/loyalty';

export const getLoyaltyConfig = (): Promise<LoyaltyConfig> =>
  apiClient.get('/loyalty/config/').then(r => r.data);

export const updateLoyaltyConfig = (payload: UpdateLoyaltyConfigPayload): Promise<LoyaltyConfig> =>
  apiClient.patch('/loyalty/config/update/', payload).then(r => r.data);
