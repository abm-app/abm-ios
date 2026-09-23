import { formatDate, getCalendarDateString } from './dateUtils';
import type { AuditEvent } from '@/types/audit';

export type AuditListRow =
  | { kind: 'day'; id: string; label: string }
  | { kind: 'event'; id: string; event: AuditEvent };

// The day an event's `detectedAt` falls on, as a plain YYYY-MM-DD in the *device's local*
// calendar — used to spot where one day ends and the next begins in an already-sorted
// (most-recent-first) event list. `detectedAt` comes off the wire as a UTC ISO string, so
// this goes through a Date (device-local getters) rather than slicing the string directly —
// slicing would read the UTC calendar day, which can be a different day than the viewer's
// local "Today"/"Yesterday" this is compared against below, especially close to local
// midnight for a property far from UTC.
function dayKey(isoStr: string): string {
  return getCalendarDateString(new Date(isoStr));
}

function dayLabel(dayKeyStr: string): string {
  const now = new Date();
  const today = getCalendarDateString(now);
  // Built from local calendar fields (not `now.getTime() - 24h`) so it's still "yesterday"
  // across a daylight-saving transition, where the previous local day isn't exactly 24
  // real-time hours away.
  const yesterday = getCalendarDateString(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
  );
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
