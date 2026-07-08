import { useQuery } from '@tanstack/react-query';
import { getRoomTypes } from '@/api/endpoints/roomApi';

export const roomKeys = {
  all: ['rooms'] as const,
  types: () => [...roomKeys.all, 'types'] as const,
};

export function useRoomTypes() {
  return useQuery({
    queryKey: roomKeys.types(),
    queryFn: getRoomTypes,
  });
}
