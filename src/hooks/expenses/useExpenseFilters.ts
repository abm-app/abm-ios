import { useMemo, useState } from 'react';

import { useAuthStore } from '@/store/authStore';
import type { AuditProperty } from '@/types/audit';
import { formatMonthYear, getMonthDateRange } from '@/utils/dateUtils';

export type PropertyFilter = AuditProperty | 'all';

const ALL_PROPERTIES: AuditProperty[] = ['express', 'international'];

const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

// The hotels the signed-in owner can record expenses for.
export function useAllowedProperties(): AuditProperty[] {
  const property = useAuthStore(state => state.user?.property);
  return useMemo(
    () => (property === 'express' || property === 'international' ? [property] : ALL_PROPERTIES),
    [property],
  );
}

export function useExpenseFilters() {
  const [currentMonth] = useState(() => startOfMonth(new Date()));
  const [month, setMonth] = useState<Date>(currentMonth);
  const [property, setProperty] = useState<PropertyFilter>('all');

  const range = useMemo(() => getMonthDateRange(month), [month]);
  const isCurrentMonth = month.getTime() === currentMonth.getTime();

  const goToPreviousMonth = () =>
    setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goToNextMonth = () => {
    if (isCurrentMonth) return;
    setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return {
    from: range.from,
    to: range.to,
    monthLabel: formatMonthYear(month),
    isCurrentMonth,
    goToPreviousMonth,
    goToNextMonth,
    property,
    setProperty,
    apiProperty: property === 'all' ? undefined : property,
  };
}
