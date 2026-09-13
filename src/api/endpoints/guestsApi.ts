import apiClient from '../client';
import type { GuestFilters, GuestResponse, Guest, CommunicationLogResponse } from '@/types/guest';
import type { GuestStaysResponse } from '@/types/booking';

export const getGuests = (filters: GuestFilters): Promise<GuestResponse> =>
  apiClient.get<GuestResponse>('/guests/', { params: filters }).then(r => r.data);

export const getGuestById = (id: string): Promise<Guest> =>
  apiClient.get<Guest>(`/guests/${id}/`).then(r => r.data);

export const getGuestStays = (guestId: string): Promise<GuestStaysResponse> =>
  apiClient.get<GuestStaysResponse>(`/guests/${guestId}/stays/`).then(r => r.data);

export const updateGuestDnc = (guestId: string, doNotContact: boolean): Promise<Guest> =>
  apiClient.patch<Guest>(`/guests/${guestId}/dnc/`, { doNotContact }).then(r => r.data);

export const getGuestCommunications = (
  guestId: string,
  page = 1,
  limit = 20,
): Promise<CommunicationLogResponse> =>
  apiClient
    .get<CommunicationLogResponse>(`/guests/${guestId}/messages/`, { params: { page, limit } })
    .then(r => r.data);
