import { useMutation } from '@tanstack/react-query';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';

import { getDailyReportPdf } from '@/api/endpoints/reportsApi';
import { useAuthStore } from '@/store/authStore';
import logger from '@/utils/logger';

interface DownloadReportPdfParams {
  date: string;
}

// Fetches the daily report PDF for `date` and opens the OS share sheet so the user can
// save or open it — there's no universal in-app PDF viewer to hand off to on either
// platform, so "Open with…" is the standard Expo pattern here.
//
// Scoped to the *current* user's own property, not anything derived from the notification
// itself — report_ready notifications only carry a date (see
// abm-backend/notifications/dispatch.py create_report_notification(), which never records
// which property triggered it). This isn't a workaround: a property-scoped manager can
// never see another property's data regardless (backend's IsManagerOrAbove + property
// scoping would reject it), so keying off the logged-in user's own `property` is the
// actually-correct behavior, not just the only one available.
export function useDownloadReportPdf() {
  return useMutation({
    mutationFn: async ({ date }: DownloadReportPdfParams) => {
      const userProperty = useAuthStore.getState().user?.property;
      const property =
        userProperty === 'express' || userProperty === 'international' ? userProperty : undefined;

      const pdfBytes = await getDailyReportPdf({ date, property });

      const file = new File(Paths.cache, `abm-daily-report-${date}.pdf`);
      file.create({ overwrite: true });
      file.write(new Uint8Array(pdfBytes));

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        logger.warn('[useDownloadReportPdf] Sharing is not available on this device');
        return;
      }
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Daily Report — ${date}`,
      });
    },
    onError: error => {
      logger.error('[useDownloadReportPdf] Failed to download/share report PDF', error);
    },
  });
}
