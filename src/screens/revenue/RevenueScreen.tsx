import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeaderV2 } from '@/components/shared/ScreenHeader';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import ErrorState from '@/components/shared/ErrorState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Card from '@/components/ui/Card';
import tokens from '@/theme/tokens';
import { useRevenueSummary } from '@/hooks/revenue/useRevenue';
import { useRevenueTrends } from '@/hooks/revenue/useRevenue';
import type { RevenuePeriod } from '@/types/revenue';
import { formatCurrency } from '@/utils/formatters';
import { formatMonth } from '@/utils/dateUtils';
import { Backdrop } from '@/components/shared';

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

export default function RevenueScreen() {
  const [period, setPeriod] = useState<RevenuePeriod>('month');
  const insets = useSafeAreaInsets();

  const summaryQuery = useRevenueSummary(period);
  const trendsQuery = useRevenueTrends();

  const summary = summaryQuery.data;
  const trends = useMemo(() => trendsQuery.data?.trends ?? [], [trendsQuery.data?.trends]);

  const totalRevenue = summary
    ? (summary.international?.totalRevenue ?? 0) + (summary.express?.totalRevenue ?? 0)
    : 0;
  const totalTax = summary
    ? (summary.international?.totalTax ?? 0) + (summary.express?.totalTax ?? 0)
    : 0;
  const totalBookings = summary
    ? (summary.international?.bookingCount ?? 0) + (summary.express?.bookingCount ?? 0)
    : 0;

  const last6Trends = useMemo(() => trends.slice(-6), [trends]);

  const maxTrend = useMemo(() => {
    if (last6Trends.length === 0) return 1;
    return Math.max(...last6Trends.map(t => (t.international ?? 0) + (t.express ?? 0)));
  }, [last6Trends]);

  const internationalTotal = summary?.international?.totalRevenue ?? 0;
  const expressTotal = summary?.express?.totalRevenue ?? 0;
  const propertyMax = Math.max(internationalTotal, expressTotal, 1);

  const isLoading = summaryQuery.isLoading || trendsQuery.isLoading;
  const isError = summaryQuery.isError || trendsQuery.isError;

  const handleRetry = () => {
    summaryQuery.refetch();
    trendsQuery.refetch();
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState message="Failed to load revenue data." onRetry={handleRetry} />;

  const bottomClearance =
    Math.max(insets.bottom, tokens.navigation.paddingVertical) +
    tokens.navigation.height +
    tokens.spacing.lg;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Backdrop />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: bottomClearance }]}
      >
        <ScreenHeaderV2
          title="Revenue"
          subtitle={PERIOD_LABELS[period]}
          showSearch={false}
          showFilter={false}
          showNotifications={false}
          showRightButton={false}
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
        {last6Trends.length > 0 && (
          <Card variant="outlined" padded style={styles.card}>
            <Text style={styles.cardLabel}>Monthly Trend</Text>
            <View style={styles.chartContainer}>
              {last6Trends.map(item => {
                const combined = (item.international ?? 0) + (item.express ?? 0);
                const heightPct = maxTrend > 0 ? combined / maxTrend : 0;
                const safeHeightPct = Number.isNaN(heightPct) ? 0 : heightPct;
                return (
                  <View key={item.month} style={styles.barWrapper}>
                    <Text style={styles.barValue}>{formatCurrency(combined)}</Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[styles.barFill, { height: `${Math.max(safeHeightPct * 100, 4)}%` }]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{formatMonth(item.month)}</Text>
                  </View>
                );
              })}
            </View>
          </Card>
        )}

        {/* Property Breakdown */}
        <Card variant="outlined" padded style={styles.card}>
          <Text style={styles.cardLabel}>Property Breakdown</Text>

          <View style={styles.propertyRow}>
            <Text style={styles.propertyName}>International</Text>
            <Text style={styles.propertyValue}>{formatCurrency(internationalTotal)}</Text>
          </View>
          <View style={styles.barTrackHoriz}>
            <View
              style={[
                styles.barFillHoriz,
                { width: `${(internationalTotal / propertyMax) * 100}%` },
              ]}
            />
          </View>

          <View style={[styles.propertyRow, styles.propertyRowGap]}>
            <Text style={styles.propertyName}>Express</Text>
            <Text style={styles.propertyValue}>{formatCurrency(expressTotal)}</Text>
          </View>
          <View style={styles.barTrackHoriz}>
            <View
              style={[
                styles.barFillHoriz,
                styles.barFillHorizAlt,
                { width: `${(expressTotal / propertyMax) * 100}%` },
              ]}
            />
          </View>
        </Card>
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
    fontWeight: '600',
    color: tokens.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: tokens.spacing.sm,
  },
  headline: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: 40,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
    letterSpacing: -1,
  },
  subline: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginTop: 2,
  },
  bookingRow: {
    marginTop: tokens.spacing.sm,
  },
  bookingText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textSecondary,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 8,
    marginTop: tokens.spacing.sm,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 8,
    color: tokens.colors.textMuted,
    marginBottom: 2,
  },
  barTrack: {
    flex: 1,
    width: '100%',
    backgroundColor: tokens.colors.surface,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: tokens.colors.primary,
    borderRadius: 4,
  },
  barLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 9,
    color: tokens.colors.textMuted,
    marginTop: 4,
  },
  propertyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  propertyRowGap: {
    marginTop: tokens.spacing.md,
  },
  propertyName: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
    fontWeight: '500',
  },
  propertyValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
    fontWeight: '600',
  },
  barTrackHoriz: {
    height: 8,
    backgroundColor: tokens.colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFillHoriz: {
    height: '100%',
    backgroundColor: tokens.colors.primary,
    borderRadius: 4,
  },
  barFillHorizAlt: {
    backgroundColor: tokens.colors.textSecondary,
  },
});
