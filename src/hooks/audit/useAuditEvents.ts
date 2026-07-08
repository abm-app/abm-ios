import { useInfiniteQuery } from '@tanstack/react-query';
import { getAuditEvents } from '@/api/endpoints/auditApi';

export interface AuditFilters {
  property?: string[];
  eventType?: string[];
  rmCode?: string[];
  from?: string;
  to?: string;
}

export function useAuditEvents(filters?: AuditFilters) {
  const query = useInfiniteQuery({
    queryKey: ['auditEvents', filters ?? {}],
    queryFn: ({ pageParam }) => getAuditEvents({ page: pageParam as number, limit: 20, filters }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage.page * lastPage.limit >= lastPage.total) {
        return undefined;
      }
      return lastPage.page + 1;
    },
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    query;

  return {
    events: data?.pages.flatMap(p => p.events) ?? [],
    total: data?.pages[0]?.total ?? 0,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  };
}
