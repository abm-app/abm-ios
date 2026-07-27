export type RevenuePeriod = 'day' | 'week' | 'month';

export interface RevenuePropertyData {
  totalRevenue: number;
  totalTax: number;
  bookingCount: number;
}

export interface RevenueSummaryResponse {
  period: RevenuePeriod;
  properties?: {
    international?: RevenuePropertyData;
    express?: RevenuePropertyData;
  };
}

export interface RevenueTrendMonth {
  month: string; // e.g. "2025-01"
  international?: RevenuePropertyData;
  express?: RevenuePropertyData;
}

export interface RevenueTrendsResponse {
  trends: RevenueTrendMonth[];
}
