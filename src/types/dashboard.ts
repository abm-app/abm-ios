export type RecentEventType = 'check_in' | 'rate_override';

export interface OccupancyProperty {
  name: string;
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
  todayRevenue: Record<string, number>;
  recentEvents: RecentEvent[];
  unreadNotifications: number;
  lastSyncedAt: string;
}
