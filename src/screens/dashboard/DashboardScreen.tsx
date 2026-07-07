import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDashboardSummary } from '../../hooks/dashboard/useDashboardSummary';
import RevenueSummary from './components/RevenueSummary';
import RecentActivityFeed from './components/RecentActivityFeed';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorState from '../../components/shared/ErrorState';
import tokens from '../../theme/tokens';
import OccupancySection from './components/OccupancySection';

export default function DashboardScreen() {
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !data) {
    return <ErrorState message="Failed to load dashboard. Pull to refresh." onRetry={refetch} />;
  }

  const bottomClearance =
    Math.max(insets.bottom, tokens.navigation.paddingVertical) + tokens.navigation.height + 16;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomClearance }]}
        showsVerticalScrollIndicator={false}
      >
        <OccupancySection
          occupancy={data.occupancy}
          unreadNotifications={data.unreadNotifications}
          lastSyncedAt={data.lastSyncedAt}
        />
        <View style={styles.gap} />
        <RevenueSummary todayRevenue={data.todayRevenue} />
        <View style={styles.gap} />
        <RecentActivityFeed events={data.recentEvents} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.dashboardBg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: tokens.spacing.lgMd,
  },
  gap: {
    height: tokens.spacing.lgMd,
  },
});
