import { useQuery } from '@tanstack/react-query';
import { File, Paths } from 'expo-file-system';

import { getDailyReportPdf } from '@/api/endpoints/reportsApi';
import { useAuthStore } from '@/store/authStore';

// Scoped to the current user's own property, not anything derived from the notification —
// report_ready notifications only carry a date (see abm-backend/notifications/dispatch.py
// create_report_notification()), and a property-scoped manager can never see another
// property's data anyway.
export function useReportPdf(date: string) {
  return useQuery({
    queryKey: ['report-pdf', date],
    queryFn: async () => {
      const userProperty = useAuthStore.getState().user?.property;
      const property =
        userProperty === 'express' || userProperty === 'international' ? userProperty : undefined;

      const pdfBytes = await getDailyReportPdf({ date, property });

      const file = new File(Paths.cache, `abm-daily-report-${date}.pdf`);
      file.create({ overwrite: true });
      file.write(new Uint8Array(pdfBytes));
      return { uri: file.uri, base64: await file.base64() };
    },
    staleTime: 0,
    gcTime: 0,
  });
}
