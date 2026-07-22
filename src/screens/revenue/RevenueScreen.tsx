import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenHeaderV2 } from '@/components/shared/ScreenHeader';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import ErrorState from '@/components/shared/ErrorState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Card from '@/components/ui/Card';
import tokens from '@/theme/tokens';
import { useRevenueSummary } from '@/hooks/revenue/useRevenue';
import { useRevenueTrends } from '@/hooks/revenue/useRevenue';
import type { RevenuePeriod } from '@/types/revenue';
import type { AdminStackParamList } from '@/navigation/types';
import { formatCurrency } from '@/utils/formatters';
import { Backdrop, TrendChart, PropertyBreakdown } from '@/components/shared';

const PERIOD_TABS = [
  { id: 'day', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
] as const;

const PERIOD_LABELS: Record<RevenuePeriod, string> = {
  day: 'Today',
  week: 'This Week',
  month: 'This Month',
};

type Props = NativeStackScreenProps<AdminStackParamList, 'RevenueAnalytics'>;

export default function RevenueScreen({ navigation }: Props) {
  const [period, setPeriod] = useState<RevenuePeriod>('month');
  const insets = useSafeAreaInsets();

  const summaryQuery = useRevenueSummary(period);
  const trendsQuery = useRevenueTrends();

  const summary = summaryQuery.data;
  const trends = trendsQuery.data;

  const totalRevenue = summary?.totals?.totalRevenue ?? 0;
  const totalTax = summary?.totals?.totalTax ?? 0;
  const totalBookings = summary?.totals?.totalBookings ?? 0;
  const last6Trends = trends?.last6Trends ?? [];
  const maxTrend = trends?.maxTrend ?? 1;
  const internationalTotal = summary?.internationalTotal ?? 0;
  const expressTotal = summary?.expressTotal ?? 0;
  const propertyMax = summary?.propertyMax ?? 1;

  const isLoading = summaryQuery.isLoading || trendsQuery.isLoading;
  const isError = summaryQuery.isError || trendsQuery.isError;

  const bottomClearance =
    Math.max(insets.bottom, tokens.navigation.paddingVertical) +
    tokens.navigation.height +
    tokens.spacing.lg;

  // ─── Memoised dynamic styles ────────────────────────────────────────────

  const contentContainerStyle = useMemo(
    () => [styles.content, { paddingBottom: bottomClearance }],
    [bottomClearance],
  );

  const handleRetry = () => {
    summaryQuery.refetch();
    trendsQuery.refetch();
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState message="Failed to load revenue data." onRetry={handleRetry} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Backdrop />
      <ScrollView style={styles.screen} contentContainerStyle={contentContainerStyle}>
        <ScreenHeaderV2
          title="Revenue"
          subtitle={PERIOD_LABELS[period]}
          showSearch={false}
          showFilter={false}
          showNotifications={false}
          showRightButton={false}
          showBackButton
          onBackPress={navigation.goBack}
        />

        <SegmentedControl
          tabs={PERIOD_TABS as unknown as { id: string; label: string }[]}
          activeTab={period}
          onChange={id => setPeriod(id as RevenuePeriod)}
          style={styles.segmented}
        />

        {/* Total Revenue Card */}
        <Card variant="outlined" padded style={styles.card}>
          <Text style={styles.cardLabel}>Total Revenue</Text>
          <Text style={styles.headline}>{formatCurrency(totalRevenue)}</Text>
          <Text style={styles.subline}>Tax: {formatCurrency(totalTax)}</Text>
          <View style={styles.bookingRow}>
            <Text style={styles.bookingText}>{totalBookings} bookings</Text>
          </View>
        </Card>

        {/* Trend Chart */}
        <TrendChart data={last6Trends} maxTrend={maxTrend} />

        {/* Property Breakdown */}
        <PropertyBreakdown
          internationalTotal={internationalTotal}
          expressTotal={expressTotal}
          propertyMax={propertyMax}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: tokens.spacing.xxl,
  },
  segmented: {
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  card: {
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  cardLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: tokens.typography.letterSpacing.captionCaps,
    marginBottom: tokens.spacing.sm,
  },
  headline: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.revenueDisplay,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.textPrimary,
    letterSpacing: tokens.typography.letterSpacing.revenueDisplay,
  },
  subline: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xxs,
  },
  bookingRow: {
    marginTop: tokens.spacing.sm,
  },
  bookingText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textSecondary,
  },
});
