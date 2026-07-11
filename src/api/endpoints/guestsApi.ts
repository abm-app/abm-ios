import apiClient from '../client';
import type { GuestFilters, GuestResponse, Guest, GuestProfileResponse } from '@/types/guest';
import { updateGuestDnc as updateMockDnc, fetchGuestCommunications } from './mockGuestData';

export const getGuests = (filters: GuestFilters): Promise<GuestResponse> =>
  apiClient.get('/guests', { params: filters }).then(r => r.data);

export const getGuestById = (id: string): Promise<Guest> =>
  apiClient.get(`/guests/${id}`).then(r => r.data);

export const updateGuestDnc = (
  id: string,
  doNotContact: boolean,
): Promise<GuestProfileResponse> => {
  return updateMockDnc(id, doNotContact);
};

export const getGuestCommunications = (id: string) => {
  return fetchGuestCommunications(id);
};
