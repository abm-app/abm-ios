import apiClient from '../client';
import type { GuestFilters, GuestResponse, Guest, GuestProfileResponse, CommunicationLogEvent } from '@/types/guest';
import { updateGuestDnc as updateMockDnc } from './mockGuestData';

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

export const getGuestCommunications = (guestId: string): Promise<CommunicationLogEvent[]> =>
  apiClient.get(`/guests/${guestId}/messages/`).then((r) => r.data);
