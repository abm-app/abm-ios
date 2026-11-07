import { useMutation } from '@tanstack/react-query';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { exportReportPdf } from '@/api/endpoints/reportsApi';
import type { AuditProperty } from '@/types/audit';
import type { ReportPeriod } from '@/types/reports';
import { buildExportFilename } from '@/utils/reportPeriods';

interface ExportVariables {
  period: ReportPeriod;
  property: AuditProperty;
}

// Downloads the PDF with the bearer token (a plain link would 401), saves it to the cache and
// opens the system share sheet, where the user can save or send it. Same on iOS and Android.
export function useReportExport() {
  return useMutation({
    mutationFn: async ({ period, property }: ExportVariables): Promise<string> => {
      const { bytes, filename } = await exportReportPdf({
        type: period.type,
        property,
        from: period.from,
        to: period.to,
        month: period.key,
      });

      const name = filename ?? buildExportFilename(period, property);
      const file = new File(Paths.cache, name);
      file.create({ overwrite: true });
      file.write(new Uint8Array(bytes));

      if (!(await Sharing.isAvailableAsync())) {
        throw new Error('Sharing is not available on this device');
      }
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
        dialogTitle: name,
      });
      return name;
    },
  });
}
