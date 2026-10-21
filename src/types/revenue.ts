import type { AuditProperty } from './audit';

export type RevenuePeriod = 'day' | 'week' | 'month';

export interface CategoryTotal {
  categoryId: string | null;
  name: string;
  amount: number;
}

// Owners get every field; managers only roomRevenue and cashReceived (the other keys are
// absent, not zero). Render only what is present.
export interface FinanceSummary {
  roomRevenue: number;
  cashReceived: number;
  pettyCashSpending?: number;
  extraExpenses?: number;
  net?: number;
  extraExpensesByCategory?: CategoryTotal[];
}

// Absent entirely for staff.
export interface FinanceResponse {
  combined: FinanceSummary;
  properties: Partial<Record<AuditProperty, FinanceSummary>>;
}

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
  finance?: FinanceResponse;
}

export interface RevenueTrendMonth {
  month: string; // e.g. "2025-01"
  international?: RevenuePropertyData;
  express?: RevenuePropertyData;
}

export interface RevenueTrendsResponse {
  trends: RevenueTrendMonth[];
}
