import type { GuestFilters, GuestResponse, GuestProfileResponse } from '@/types/guest';
import { fetchMockGuests, fetchGuestById } from './mockGuestData';

// import apiClient from '../client';
//
// When the real endpoint is ready, use apiClient like this:
// export const getGuests = (filters: GuestFilters): Promise<GuestResponse> =>
//   apiClient.get('/guests', { params: filters }).then((r) => r.data);

export const getGuests = (filters: GuestFilters): Promise<GuestResponse> => {
  return fetchMockGuests(filters);
};

export const getGuestById = (id: string): Promise<GuestProfileResponse> => {
  return fetchGuestById(id);
};
