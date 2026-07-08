import type { LiveStatusOverviewResponse, LiveStatusRoomsResponse } from '@/types/status';
import { mockStatusOverview, mockStatusRoomsExpress } from './mockStatusData';

export const getStatusOverview = (): Promise<LiveStatusOverviewResponse> => {
  return new Promise(resolve => setTimeout(() => resolve(mockStatusOverview), 500));
};

export const getStatusRooms = (_property: string): Promise<LiveStatusRoomsResponse> => {
  return new Promise(resolve => setTimeout(() => resolve(mockStatusRoomsExpress), 500));
};
