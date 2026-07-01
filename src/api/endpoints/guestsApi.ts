import type { GuestFilters, GuestResponse } from '@/types/guest';
import { fetchMockGuests } from './mockGuestData';

// import apiClient from '../client';
//
// When the real endpoint is ready, use apiClient like this:
// export const getGuests = (filters: GuestFilters): Promise<GuestResponse> =>
//   apiClient.get('/guests', { params: filters }).then((r) => r.data);

export const getGuests = (filters: GuestFilters): Promise<GuestResponse> => {
  return fetchMockGuests(filters);
};
