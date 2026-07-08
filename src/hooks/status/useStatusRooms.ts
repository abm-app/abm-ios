import { useQuery } from '@tanstack/react-query';
import { getStatusRooms } from '@/api/endpoints/statusApi';

export const statusRoomsKeys = {
  all: ['status', 'rooms'] as const,
  property: (property: string) => [...statusRoomsKeys.all, property] as const,
};

export function useStatusRooms(property: string, enabled: boolean = true) {
  return useQuery({
    queryKey: statusRoomsKeys.property(property),
    queryFn: () => getStatusRooms(property),
    enabled,
  });
}
