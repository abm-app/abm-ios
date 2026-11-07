import { REPORT_LOOKBACK_MONTHS } from '@/constants';
import type { AuditProperty } from '@/types/audit';
import type { ReportPeriod, ReportType } from '@/types/reports';

// All report dates are IST calendar dates as YYYY-MM-DD strings. Date maths runs on UTC-based
// Date objects built from those strings, so the device timezone can never shift a day.

const DAY_MS = 86_400_000;
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseIso(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

function mondayOf(date: Date): Date {
  return addDays(date, -((date.getUTCDay() + 6) % 7));
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function formatShort(date: Date): string {
  return `${date.getUTCDate()} ${MONTHS_SHORT[date.getUTCMonth()]}`;
}

function formatLong(date: Date): string {
  return `${WEEKDAYS[date.getUTCDay()]} ${formatShort(date)} ${date.getUTCFullYear()}`;
}

// The same day of the previous month(s), clamped so 31 Mar looks back to 28 Feb, not 3 Mar.
function windowStart(today: Date): Date {
  const target = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - REPORT_LOOKBACK_MONTHS, 1),
  );
  const day = Math.min(
    today.getUTCDate(),
    daysInMonth(target.getUTCFullYear(), target.getUTCMonth()),
  );
  return new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), day));
}

// Today's calendar date in IST, whatever the device timezone is.
export function todayIST(now: Date = new Date()): string {
  return toIso(new Date(now.getTime() + IST_OFFSET_MS));
}

function buildDaily(from: string, today: string): ReportPeriod {
  return {
    type: 'daily',
    key: from,
    label: formatLong(parseIso(from)),
    subtitle: null,
    from,
    to: from,
    inProgress: from === today,
  };
}

// A week belongs to the month its Monday falls in; "Week N" is that Monday's place among the
// month's Mondays, so Mon 26 Oct is October Week 4 and Mon 2 Nov is November Week 1.
function buildWeekly(from: string, today: string): ReportPeriod {
  const monday = parseIso(from);
  const sunday = addDays(monday, 6);
  const sundayIso = toIso(sunday);
  const week = Math.ceil(monday.getUTCDate() / 7);
  return {
    type: 'weekly',
    key: from,
    label: `${MONTHS_LONG[monday.getUTCMonth()]} · Week ${week}`,
    subtitle: `${formatShort(monday)} – ${formatShort(sunday)}`,
    from,
    to: sundayIso > today ? today : sundayIso,
    inProgress: sundayIso >= today,
  };
}

function buildMonthly(from: string, today: string): ReportPeriod {
  const first = parseIso(from);
  const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0));
  const lastIso = toIso(last);
  return {
    type: 'monthly',
    key: from.slice(0, 7),
    label: `${MONTHS_LONG[first.getUTCMonth()]} ${first.getUTCFullYear()}`,
    subtitle: null,
    from,
    to: lastIso > today ? today : lastIso,
    inProgress: lastIso >= today,
  };
}

// Rebuilds a period from the values a route carries: the day, the week's Monday, or the 1st.
export function buildPeriod(
  type: ReportType,
  from: string,
  today: string = todayIST(),
): ReportPeriod {
  if (type === 'weekly') return buildWeekly(from, today);
  if (type === 'monthly') return buildMonthly(from, today);
  return buildDaily(from, today);
}

export function buildDailyPeriods(today: string = todayIST()): ReportPeriod[] {
  const end = parseIso(today);
  const start = windowStart(end);
  const periods: ReportPeriod[] = [];
  for (let day = end; day >= start; day = addDays(day, -1)) {
    periods.push(buildDaily(toIso(day), today));
  }
  return periods;
}

export function buildWeeklyPeriods(today: string = todayIST()): ReportPeriod[] {
  const end = parseIso(today);
  const start = windowStart(end);
  const periods: ReportPeriod[] = [];
  for (let monday = mondayOf(end); addDays(monday, 6) >= start; monday = addDays(monday, -7)) {
    periods.push(buildWeekly(toIso(monday), today));
  }
  return periods;
}

export function buildMonthlyPeriods(today: string = todayIST()): ReportPeriod[] {
  const end = parseIso(today);
  const periods: ReportPeriod[] = [];
  for (let back = 0; back <= REPORT_LOOKBACK_MONTHS; back += 1) {
    const first = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - back, 1));
    periods.push(buildMonthly(toIso(first), today));
  }
  return periods;
}

export function buildPeriods(type: ReportType, today: string = todayIST()): ReportPeriod[] {
  if (type === 'weekly') return buildWeeklyPeriods(today);
  if (type === 'monthly') return buildMonthlyPeriods(today);
  return buildDailyPeriods(today);
}

// "Fri 6 Nov 2026" for a day, "26 Oct – 1 Nov 2026" for a range.
export function formatPeriodLabel(period: ReportPeriod): string {
  if (period.type === 'daily') return formatLong(parseIso(period.from));
  return `${formatShort(parseIso(period.from))} – ${formatShort(parseIso(period.to))} ${parseIso(period.to).getUTCFullYear()}`;
}

export function getScorecardTitle(period: ReportPeriod): string {
  return period.type === 'daily' ? 'Flash Report' : period.label;
}

// Mirrors the server's Content-Disposition name; used only if the header can't be read.
export function buildExportFilename(period: ReportPeriod, property: AuditProperty): string {
  const prefix = `abm_${property}`;
  if (period.type === 'daily') return `${prefix}_daily_${period.from}.pdf`;
  if (period.type === 'weekly') return `${prefix}_weekly_${period.from}_to_${period.to}.pdf`;
  return `${prefix}_monthly_${period.key}.pdf`;
}
