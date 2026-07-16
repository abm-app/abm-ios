import { useQuery } from '@tanstack/react-query';
import { getStatusOverview } from '@/api/endpoints/statusApi';

export const statusOverviewKeys = {
  all: ['status', 'overview'] as const,
};

export function useStatusOverview() {
  return useQuery({
    queryKey: statusOverviewKeys.all,
    queryFn: getStatusOverview,
  });
}

export function useStatusOverviewStats() {
  return useQuery({
    queryKey: statusOverviewKeys.all,
    queryFn: getStatusOverview,
    select: data => {
      let total = 0;
      let departures = 0;
      let arrivals = 0;
      data.properties.forEach(p => {
        total += p.totalRooms;
        departures += p.checkingOutToday;
        arrivals += p.arrivingToday;
      });
      return { total, departures, arrivals };
    },
  });
}
