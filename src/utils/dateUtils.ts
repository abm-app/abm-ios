const MONTH_NAMES = [
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

export const formatDate = (isoStr?: string): string | null => {
  if (!isoStr) return null;
  const datePart = isoStr.split('T')[0];
  if (!datePart) return null;
  const [year, month, day] = datePart.split('-');
  if (!year || !month || !day) return null;
  const monthIndex = Number(month) - 1;
  const dayNumber = Number(day);
  if (
    !Number.isInteger(monthIndex + 1) ||
    monthIndex < 0 ||
    monthIndex > 11 ||
    !Number.isInteger(dayNumber)
  ) {
    return null;
  }
  return `${dayNumber} ${MONTH_NAMES[monthIndex]}, ${year}`;
};

export const formatDateShort = (isoStr?: string): string => {
  if (!isoStr) return '';
  const datePart = isoStr.split('T')[0];
  if (!datePart) return isoStr;
  const [year, month, day] = datePart.split('-');
  if (!year || !month || !day) return isoStr;
  const monthIndex = Number(month) - 1;
  const dayNumber = Number(day);
  if (
    !Number.isInteger(monthIndex + 1) ||
    monthIndex < 0 ||
    monthIndex > 11 ||
    !Number.isInteger(dayNumber)
  ) {
    return isoStr;
  }
  const paddedDay = String(dayNumber).padStart(2, '0');
  return `${MONTH_NAMES[monthIndex]} ${paddedDay}`;
};

export const getCalendarDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateString = (dateStr?: string): Date | undefined => {
  if (!dateStr) return undefined;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return undefined;
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
};

export const formatDateTime = (isoStr?: string): string | null => {
  if (!isoStr) return null;
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
  // e.g. "8 Jul 2026, 04:30 pm"
};

// Shifted manually rather than via Intl's timeZone option, which Hermes does
// not reliably support across platforms.
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

const toIstParts = (isoStr?: string) => {
  if (!isoStr) return null;
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return null;

  const ist = new Date(date.getTime() + IST_OFFSET_MS);
  const rawHours = ist.getUTCHours();
  return {
    day: ist.getUTCDate(),
    month: MONTH_NAMES[ist.getUTCMonth()],
    year: ist.getUTCFullYear(),
    hours: String(rawHours % 12 || 12).padStart(2, '0'),
    minutes: String(ist.getUTCMinutes()).padStart(2, '0'),
    meridiem: rawHours >= 12 ? 'pm' : 'am',
  };
};

/** e.g. "12 Sep 2026, 10:30 am" — always IST, regardless of device timezone. */
export const formatDateTimeIST = (isoStr?: string): string | null => {
  const p = toIstParts(isoStr);
  if (!p) return null;
  return `${p.day} ${p.month} ${p.year}, ${p.hours}:${p.minutes} ${p.meridiem}`;
};

/** e.g. "10:30 am" — always IST. */
export const formatTimeIST = (isoStr?: string): string | null => {
  const p = toIstParts(isoStr);
  if (!p) return null;
  return `${p.hours}:${p.minutes} ${p.meridiem}`;
};

export const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString('default', { month: 'short' }).toUpperCase();
};

export const formatLastSynced = (isoStr?: string): string | null => {
  if (!isoStr) return null;
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return null;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Updated just now';
  if (diffMins < 60) return `Updated ${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Updated ${diffHours}h ago`;

  // Older than a day — show absolute date & time
  const dateStr = formatDate(isoStr);
  const timeStr = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  return `Updated ${dateStr}, ${timeStr}`;
};

export const formatTimeAgo = (isoStr?: string): string => {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return isoStr;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 0) return formatDateShort(isoStr);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDateShort(isoStr);
};
