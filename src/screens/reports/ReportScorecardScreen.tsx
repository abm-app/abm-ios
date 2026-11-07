import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import {
  AlertModal,
  Backdrop,
  ErrorState,
  LiveBadge,
  ScreenHeaderV2,
  SegmentedControl,
} from '@/components/shared';
import { useFloatingTabBarInset } from '@/hooks/useFloatingTabBarInset';
import { useFlashReport } from '@/hooks/reports/useFlashReport';
import { useReportExport } from '@/hooks/reports/useReportExport';
import { useReportProperty } from '@/hooks/reports/useReportProperty';
import type { MenuStackParamList } from '@/navigation/types';
import { PROPERTY_DISPLAY_NAMES } from '@/types/audit';
import type { AuditProperty } from '@/types/audit';
import { getApiErrorMessage } from '@/utils/apiError';
import { buildPeriod, formatPeriodLabel, getScorecardTitle } from '@/utils/reportPeriods';
import PropertyChip from './components/PropertyChip';
import ScorecardBody from './components/ScorecardBody';
import ScorecardSkeleton from './components/ScorecardSkeleton';

type Props = NativeStackScreenProps<MenuStackParamList, 'ReportScorecard'>;

const PROPERTY_TABS = (Object.keys(PROPERTY_DISPLAY_NAMES) as AuditProperty[]).map(id => ({
  id,
  label: PROPERTY_DISPLAY_NAMES[id],
}));

export default function ReportScorecardScreen({ route, navigation }: Props) {
  const { type, from } = route.params;
  const insets = useSafeAreaInsets();
  const tabBarInset = useFloatingTabBarInset();
  const period = useMemo(() => buildPeriod(type, from), [type, from]);
  const { property, setProperty, isScoped } = useReportProperty();
  const { data, isLoading, isError, error, refetch } = useFlashReport({
    type,
    property,
    from: period.from,
    to: period.to,
  });
  const exportReport = useReportExport();
  const [exportError, setExportError] = useState('');

  const contentStyle = useMemo(
    () => [styles.content, { paddingBottom: tabBarInset }],
    [tabBarInset],
  );
  const rootStyle = useMemo(() => [styles.root, { paddingTop: insets.top }], [insets.top]);

  const handleExport = () => {
    exportReport.mutate(
      { period, property },
      { onError: err => setExportError(getApiErrorMessage(err, 'Could not export the report.')) },
    );
  };

  const renderBody = () => {
    if (isLoading) return <ScorecardSkeleton />;
    if (isError || !data) {
      return (
        <ErrorState
          message={getApiErrorMessage(
            error,
            "Couldn't load this report. Check your connection and try again.",
          )}
          onRetry={() => refetch()}
        />
      );
    }
    return <ScorecardBody data={data} />;
  };

  return (
    <View style={rootStyle}>
      <Backdrop />

      <ScreenHeaderV2
        title={getScorecardTitle(period)}
        showBackButton
        onBackPress={() => navigation.goBack()}
        showNotifications={false}
        rightButtonText={exportReport.isPending ? 'Exporting' : 'Export'}
        rightButtonIcon="upload"
        rightButtonLoading={exportReport.isPending}
        onRightButtonPress={handleExport}
      />

      <ScrollView contentContainerStyle={contentStyle}>
        <View style={styles.periodRow}>
          <Text style={styles.periodLabel}>{formatPeriodLabel(period)}</Text>
          {period.inProgress && <LiveBadge />}
        </View>

        {isScoped ? (
          <PropertyChip property={property} />
        ) : (
          <SegmentedControl
            tabs={PROPERTY_TABS}
            activeTab={property}
            onChange={id => setProperty(id as AuditProperty)}
            style={styles.propertyToggle}
          />
        )}

        {renderBody()}
      </ScrollView>

      <AlertModal
        visible={exportError !== ''}
        onClose={() => setExportError('')}
        title="Export failed"
        content={exportError}
        iconVariant="danger"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: tokens.spacing.lg,
    gap: tokens.spacing.mdLg,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  periodLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.input,
    color: tokens.colors.textSecondary,
  },
  propertyToggle: {
    width: '100%',
  },
});
