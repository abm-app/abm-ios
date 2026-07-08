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
