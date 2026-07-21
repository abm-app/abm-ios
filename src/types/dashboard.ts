import type { AuditEventType, AuditProperty } from './audit';

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
  eventType: AuditEventType;
  regId: number;
  rmCode: string;
  property: AuditProperty;
  guestName: string;
  before: Record<string, unknown>;
  after: RecentEventAfter;
  actor: string;
  detectedAt: string;
  idempotencyKey: string;
}

export type DashboardOccupancy = Record<AuditProperty, OccupancyProperty>;

export interface DashboardSummary {
  occupancy: DashboardOccupancy;
  todayRevenue: Record<AuditProperty, number>;
  recentEvents: RecentEvent[];
  unreadNotifications: number;
  lastSyncedAt: string;
}
