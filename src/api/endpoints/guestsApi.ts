import apiClient from '../client';
import type { GuestFilters, GuestResponse, Guest, CommunicationLogEvent } from '@/types/guest';

export const getGuests = (filters: GuestFilters): Promise<GuestResponse> =>
  apiClient.get<GuestResponse>('/guests/', { params: filters }).then(r => r.data);

export const getGuestById = (id: string): Promise<Guest> =>
  apiClient.get<Guest>(`/guests/${id}/`).then(r => r.data);

export const updateGuestDnc = (guestId: string, doNotContact: boolean): Promise<Guest> =>
  apiClient.patch<Guest>(`/guests/${guestId}/dnc/`, { doNotContact }).then(r => r.data);

export const getGuestCommunications = (
  guestId: string,
): Promise<{ messages: CommunicationLogEvent[]; total: number }> =>
  apiClient
    .get<{ messages: CommunicationLogEvent[]; total: number }>(`/guests/${guestId}/messages/`)
    .then(r => r.data);
