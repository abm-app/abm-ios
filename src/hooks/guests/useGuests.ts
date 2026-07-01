import { useInfiniteQuery } from '@tanstack/react-query';
import { getGuests } from '@/api/endpoints/guestsApi';
import type { GuestFilters } from '@/types/guest';

export const guestsKeys = {
  all: ['guests'] as const,
  list: (filters: GuestFilters) => [...guestsKeys.all, 'list', filters] as const,
};

export function useInfiniteGuests(filters: Omit<GuestFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: guestsKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => getGuests({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const { page, limit, total } = lastPage;
      const hasMore = page * limit < total;
      return hasMore ? page + 1 : undefined;
    },
  });
}
