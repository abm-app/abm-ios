import { useQuery } from '@tanstack/react-query';
import { getStatusRooms } from '@/api/endpoints/statusApi';
import type { PropertyKey } from '@/types/status';

export const statusRoomsKeys = {
  all: ['status', 'rooms'] as const,
  property: (property: PropertyKey) => [...statusRoomsKeys.all, property] as const,
};

export function useStatusRooms(property: PropertyKey, enabled: boolean = true) {
  return useQuery({
    queryKey: statusRoomsKeys.property(property),
    queryFn: () => getStatusRooms(property),
    enabled,
  });
}
