import apiClient from '../client';
import type { DashboardSummary } from '../../types/dashboard';

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiClient.get<DashboardSummary>('/dashboard').then(r => r.data);
}
