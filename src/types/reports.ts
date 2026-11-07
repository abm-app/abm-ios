import type { AuditProperty } from '@/types/audit';
import type { FinanceSummary } from '@/types/revenue';

// Owner gets every key, manager only roomRevenue and cashReceived, staff no finance at all.
export type ReportFinance = FinanceSummary;

export type ReportType = 'daily' | 'weekly' | 'monthly';

// Every figure of one flash-report scorecard. For a day the counts are rooms and guests; for a
// range they are room-nights and guest-nights (the labels change, the keys do not).
// `noShows`, `totalFnB` and a past day's `roomsUnderMaintenance` are null until the backend
// syncs them: show a dash, never zero.
export interface FlashBlock {
  roomsOccupied: number;
  roomsVacant: number;
  occupancyPct: number;
  avgRoomRent: number;
  revenuePAR: number;
  roomsUnderMaintenance: number | null;
  roomRevenue: number;
  arrivals: number;
  walkIns: number;
  reservations: number;
  noShows: number | null;
  cancellations: number;
  complimentaryRooms: number;
  domestic: number;
  foreigner: number;
  domesticPct: number;
  foreignerPct: number;
  houseCount: number;
  indiansInHouse: number;
  foreignersInHouse: number;
  singleOccupancy: number;
  multipleOccupancy: number;
  dayUse: number;
  totalRevenue: number;
  totalFnB: number | null;
}

export interface FlashPeriodBlock extends FlashBlock {
  days: number;
  roomNightsAvailable: number;
}

// GET /reports/flash?date=...  (the legacy `mtd` blocks are ignored)
export interface FlashDayResponse {
  date: string;
  property: AuditProperty;
  today: FlashBlock;
  finance?: { today: FinanceSummary };
}

// GET /reports/flash?from=...&to=...
export interface FlashRangeResponse {
  from: string;
  to: string;
  property: AuditProperty;
  days: number;
  period: FlashPeriodBlock;
  finance?: { period: FinanceSummary };
}

// What the scorecard renders, whichever request produced it.
export interface ScorecardData {
  block: FlashBlock;
  // Number of days for a weekly or monthly scorecard, null for a single day.
  days: number | null;
  // Null for staff (no `finance` key). Owner-only keys are optional inside.
  finance: ReportFinance | null;
}

export interface ReportPeriod {
  type: ReportType;
  // Stable list key: the date, the Monday, or YYYY-MM.
  key: string;
  label: string;
  subtitle: string | null;
  from: string;
  // Inclusive end, clamped to today for a period still in progress.
  to: string;
  inProgress: boolean;
}

export interface FlashReportParams {
  type: ReportType;
  property: AuditProperty;
  from: string;
  to: string;
}

export interface ExportReportParams {
  type: ReportType;
  property: AuditProperty;
  from: string;
  to: string;
  // YYYY-MM, only for a monthly export.
  month: string;
}
