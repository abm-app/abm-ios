import { useQuery } from '@tanstack/react-query';
import { getRevenueSummary, getRevenueTrends } from '@/api/endpoints/revenueApi';
import type { RevenuePeriod, RevenueSummaryResponse, RevenueTrendsResponse } from '@/types/revenue';

interface RevenueSummaryEnriched {
  totals: {
    totalRevenue: number;
    totalTax: number;
    totalBookings: number;
  };
  internationalTotal: number;
  expressTotal: number;
  propertyMax: number;
}

export function useRevenueSummary(period: RevenuePeriod) {
  return useQuery<RevenueSummaryResponse, Error, RevenueSummaryEnriched>({
    queryKey: ['revenueSummary', period],
    queryFn: () => getRevenueSummary(period),
    select: data => {
      const intlRev = data.international?.totalRevenue ?? 0;
      const expRev = data.express?.totalRevenue ?? 0;
      return {
        totals: {
          totalRevenue: intlRev + expRev,
          totalTax: (data.international?.totalTax ?? 0) + (data.express?.totalTax ?? 0),
          totalBookings:
            (data.international?.bookingCount ?? 0) + (data.express?.bookingCount ?? 0),
        },
        internationalTotal: intlRev,
        expressTotal: expRev,
        propertyMax: Math.max(intlRev, expRev, 1),
      };
    },
  });
}

interface RevenueTrendsEnriched {
  last6Trends: RevenueTrendsResponse['trends'];
  maxTrend: number;
}

export function useRevenueTrends() {
  return useQuery<RevenueTrendsResponse, Error, RevenueTrendsEnriched>({
    queryKey: ['revenueTrends'],
    queryFn: getRevenueTrends,
    select: data => {
      const last6 = data.trends.slice(-6);
      const max =
        last6.length > 0
          ? Math.max(...last6.map(t => (t.international ?? 0) + (t.express ?? 0)))
          : 1;
      return {
        last6Trends: last6,
        maxTrend: max,
      };
    },
  });
}
