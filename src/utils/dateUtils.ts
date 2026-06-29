export const formatDate = (isoStr?: string): string | null => {
  if (!isoStr) return null;
  const [year, month, day] = isoStr.split('-');
  const monthNames = [
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
  const monthName = monthNames[parseInt(month, 10) - 1];
  return `${day} ${monthName}, ${year}`;
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
