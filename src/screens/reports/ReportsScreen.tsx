import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { Backdrop, ListSurface, ScreenHeaderV2, SegmentedControl } from '@/components/shared';
import { useFloatingTabBarInset } from '@/hooks/useFloatingTabBarInset';
import { useReportPreferences } from '@/hooks/reports/useReportPreferences';
import type { MenuStackParamList } from '@/navigation/types';
import type { ReportPeriod, ReportType } from '@/types/reports';
import { buildPeriods } from '@/utils/reportPeriods';
import PeriodRow from './components/PeriodRow';

type MenuNavProp = NativeStackNavigationProp<MenuStackParamList>;

const TYPE_TABS = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MenuNavProp>();
  const { type, setType } = useReportPreferences();
  const tabBarInset = useFloatingTabBarInset();

  const rootStyle = useMemo(() => [styles.root, { paddingTop: insets.top }], [insets.top]);
  const contentStyle = useMemo(
    () => [styles.scrollContent, { paddingBottom: tabBarInset }],
    [tabBarInset],
  );
  // The lists are generated here; data is fetched only when a scorecard opens.
  const periods = useMemo(() => buildPeriods(type), [type]);

  const handleOpen = (period: ReportPeriod) =>
    navigation.navigate('ReportScorecard', { type: period.type, from: period.from });

  return (
    <View style={rootStyle}>
      <Backdrop />

      <ScreenHeaderV2
        title="Reports"
        subtitle="Flash reports · IST"
        showBackButton
        onBackPress={() => navigation.goBack()}
        showRightButton={false}
        showNotifications={false}
      />

      <View style={styles.controls}>
        <SegmentedControl
          tabs={TYPE_TABS}
          activeTab={type}
          onChange={id => setType(id as ReportType)}
          style={styles.segmentedControl}
        />
      </View>

      <ScrollView contentContainerStyle={contentStyle}>
        <ListSurface style={styles.surface}>
          {periods.map((period, index) => (
            <PeriodRow
              key={period.key}
              period={period}
              onPress={handleOpen}
              isLast={index === periods.length - 1}
            />
          ))}
        </ListSurface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  controls: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
  segmentedControl: {
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.lg,
  },
  surface: {
    flex: 0,
    padding: 0,
    overflow: 'hidden',
  },
});
