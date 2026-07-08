import apiClient from '../client';
import type { LiveStatusOverviewResponse, LiveStatusRoomsResponse } from '@/types/status';

export const getStatusOverview = (): Promise<LiveStatusOverviewResponse> =>
  apiClient.get('/status/overview').then(r => r.data);

export const getStatusRooms = (property: string): Promise<LiveStatusRoomsResponse> =>
  apiClient.get('/status/rooms', { params: { property } }).then(r => r.data);
