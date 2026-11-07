import type { AnyAuditEventType, AuditProperty } from './audit';
import type { FinanceSummary } from './revenue';

export interface OccupancyProperty {
  occupied: number;
  total: number;
}

export interface RecentEventAfter {
  arrivalDate?: string;
  departureDate?: string;
  rate?: number;
  rmCode?: string;
}

export interface RecentEvent {
  id: string;
  eventType: AnyAuditEventType;
  regId: number;
  rmCode: string;
  // Category events carry no hotel.
  property?: AuditProperty;
  guestName: string;
  before: Record<string, unknown>;
  after: RecentEventAfter & Record<string, unknown>;
  actor: string;
  detectedAt: string;
  idempotencyKey: string;
}

export type DashboardOccupancy = Record<AuditProperty, OccupancyProperty>;

export interface DashboardSummary {
  occupancy: DashboardOccupancy;
  todayRevenue: Record<AuditProperty, number>;
  // Only the hotels the user can see; absent for staff.
  todayFinance?: Partial<Record<AuditProperty, FinanceSummary>>;
  recentEvents: RecentEvent[];
  unreadNotifications: number;
  lastSyncedAt: string;
}
