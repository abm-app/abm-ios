import type { Booking } from '@/types/booking';

export interface MergedStay extends Booking {
  rooms: string[];
  nights: number;
}

const SAME_DAY_TOLERANCE_MS = 12 * 60 * 60 * 1000;

// The PMS books one row per night, so consecutive rows for the same property
// are one continuous stay. Returned newest first.
export function mergeConsecutiveStays(stays: Booking[]): MergedStay[] {
  const sorted = [...stays].sort(
    (a, b) => new Date(a.checkinDate).getTime() - new Date(b.checkinDate).getTime(),
  );
  const merged: MergedStay[] = [];

  for (const stay of sorted) {
    const last = merged[merged.length - 1];
    const continues =
      last &&
      last.property === stay.property &&
      new Date(stay.checkinDate).getTime() - new Date(last.checkoutDate).getTime() <
        SAME_DAY_TOLERANCE_MS;

    if (!continues) {
      merged.push({ ...stay, rooms: [stay.rmCode], nights: 1 });
      continue;
    }

    if (new Date(stay.checkoutDate) > new Date(last.checkoutDate)) {
      last.checkoutDate = stay.checkoutDate;
      last.checkoutStaffName = stay.checkoutStaffName;
    }
    if (last.rooms[last.rooms.length - 1] !== stay.rmCode) last.rooms.push(stay.rmCode);
    if (stay.pointsEarned) last.pointsEarned = (last.pointsEarned ?? 0) + stay.pointsEarned;
    last.nights += 1;
  }

  return merged.reverse();
}
