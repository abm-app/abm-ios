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
