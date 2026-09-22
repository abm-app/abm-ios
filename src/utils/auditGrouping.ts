import { formatDate, getCalendarDateString } from './dateUtils';
import type { AuditEvent } from '@/types/audit';

export type AuditListRow =
  | { kind: 'day'; id: string; label: string }
  | { kind: 'event'; id: string; event: AuditEvent };

// The day an event's `detectedAt` falls on, as a plain YYYY-MM-DD — used to spot where one
// day ends and the next begins in an already-sorted (most-recent-first) event list.
function dayKey(isoStr: string): string {
  return isoStr.split('T')[0] ?? isoStr;
}

function dayLabel(dayKeyStr: string): string {
  const today = getCalendarDateString(new Date());
  const yesterday = getCalendarDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
  if (dayKeyStr === today) return 'Today';
  if (dayKeyStr === yesterday) return 'Yesterday';
  return formatDate(dayKeyStr) ?? dayKeyStr;
}

// Interleaves a "Today" / "Yesterday" / "12 Sep, 2026" separator row wherever the calendar
// day changes, breaking an otherwise-endless feed of events into scannable chunks. Events
// are assumed already sorted most-recent-first (that's what the audit events API returns).
export function groupEventsByDay(events: AuditEvent[]): AuditListRow[] {
  const rows: AuditListRow[] = [];
  let lastDayKey: string | null = null;

  for (const event of events) {
    const key = dayKey(event.detectedAt);
    if (key !== lastDayKey) {
      rows.push({ kind: 'day', id: `day-${key}`, label: dayLabel(key) });
      lastDayKey = key;
    }
    rows.push({ kind: 'event', id: event.id, event });
  }

  return rows;
}
