import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGuests, getGuestById, updateGuestDnc } from '@/api/endpoints/guestsApi';
import type { GuestFilters } from '@/types/guest';

export const guestsKeys = {
  all: ['guests'] as const,
  list: (filters: GuestFilters) => [...guestsKeys.all, 'list', filters] as const,
  detail: (id: string) => [...guestsKeys.all, 'detail', id] as const,
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

export function useGuest(id: string) {
  return useQuery({
    queryKey: guestsKeys.detail(id),
    queryFn: () => getGuestById(id),
  });
}

export function useUpdateGuestDnc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, doNotContact }: { id: string; doNotContact: boolean }) =>
      updateGuestDnc(id, doNotContact),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(guestsKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: guestsKeys.list({}) }); // Invalidate all list queries
    },
  });
}
