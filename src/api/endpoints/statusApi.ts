import apiClient from '@/api/client';
import type {
  LiveStatusOverviewResponse,
  LiveStatusRoomsResponse,
  PropertyKey,
} from '@/types/status';

export const getStatusOverview = (): Promise<LiveStatusOverviewResponse> => {
  return apiClient.get<LiveStatusOverviewResponse>('/status/overview').then(r => r.data);
};

export const getStatusRooms = (property: PropertyKey): Promise<LiveStatusRoomsResponse> => {
  return apiClient
    .get<LiveStatusRoomsResponse>('/status/rooms', { params: { property } })
    .then(r => r.data);
};
