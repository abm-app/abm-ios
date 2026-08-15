import { useQuery } from '@tanstack/react-query';
import { getRevenueSummary, getRevenueTrends } from '@/api/endpoints/revenueApi';
import type { RevenuePeriod, RevenueSummaryResponse, RevenueTrendsResponse } from '@/types/revenue';
import { getCalendarDateString } from '@/utils/dateUtils';

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
  const dateStr = getCalendarDateString(new Date());
  const dateParam = period === 'month' ? dateStr.substring(0, 7) : dateStr;

  return useQuery<RevenueSummaryResponse, Error, RevenueSummaryEnriched>({
    queryKey: ['revenueSummary', period, dateParam],
    queryFn: () => getRevenueSummary(period),
    select: data => {
      const intlRev = data.properties?.international?.totalRevenue ?? 0;
      const expRev = data.properties?.express?.totalRevenue ?? 0;
      return {
        totals: {
          totalRevenue: intlRev + expRev,
          totalTax:
            (data.properties?.international?.totalTax ?? 0) +
            (data.properties?.express?.totalTax ?? 0),
          totalBookings:
            (data.properties?.international?.bookingCount ?? 0) +
            (data.properties?.express?.bookingCount ?? 0),
        },
        internationalTotal: intlRev,
        expressTotal: expRev,
        propertyMax: Math.max(intlRev, expRev, 1),
      };
    },
  });
}

interface RevenueTrendsEnriched {
  trends: RevenueTrendsResponse['trends'];
  maxTrend: number;
}

export function useRevenueTrends(monthsBack = 12) {
  return useQuery<RevenueTrendsResponse, Error, RevenueTrendsEnriched>({
    queryKey: ['revenueTrends', monthsBack],
    queryFn: () => getRevenueTrends(monthsBack),
    select: data => {
      const trends = data.trends;
      const max =
        trends.length > 0
          ? Math.max(
              ...trends.map(
                t => (t.international?.totalRevenue ?? 0) + (t.express?.totalRevenue ?? 0),
              ),
            )
          : 1;
      return {
        trends,
        maxTrend: max,
      };
    },
  });
}
