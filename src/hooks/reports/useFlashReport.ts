import { useQuery } from '@tanstack/react-query';

import { getFlashReportDay, getFlashReportRange } from '@/api/endpoints/reportsApi';
import type { AuditProperty } from '@/types/audit';
import type { FlashReportParams, ScorecardData } from '@/types/reports';

export const reportKeys = {
  all: ['reports'] as const,
  flash: (type: string, property: AuditProperty, from: string, to: string) =>
    [...reportKeys.all, 'flash', type, property, from, to] as const,
};

async function fetchScorecard({
  type,
  property,
  from,
  to,
}: FlashReportParams): Promise<ScorecardData> {
  if (type === 'daily') {
    const response = await getFlashReportDay({ date: from, property });
    return { block: response.today, days: null, finance: response.finance?.today ?? null };
  }
  const response = await getFlashReportRange({ from, to, property });
  return {
    block: response.period,
    days: response.days,
    finance: response.finance?.period ?? null,
  };
}

// No placeholderData: switching property must show the loading state, never the previous
// property's numbers.
export function useFlashReport(params: FlashReportParams) {
  return useQuery({
    queryKey: reportKeys.flash(params.type, params.property, params.from, params.to),
    queryFn: () => fetchScorecard(params),
  });
}
