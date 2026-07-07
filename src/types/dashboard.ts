export type RecentEventType = 'check_in' | 'rate_override';

export interface OccupancyProperty {
  occupied: number;
  total: number;
}

export interface RecentEvent {
  id: string;
  type: RecentEventType;
  guestName: string;
  room: string;
  timestamp: string;
}

export type DashboardOccupancy = Record<string, OccupancyProperty>;

export interface DashboardSummary {
  occupancy: DashboardOccupancy;
  todayRevenue: number;
  recentEvents: RecentEvent[];
  unreadNotifications: number;
  lastSyncedAt: string;
}
