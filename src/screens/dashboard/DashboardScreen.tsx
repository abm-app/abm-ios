import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDashboardSummary } from '../../hooks/dashboard/useDashboardSummary';
import OccupancySection from '../../components/dashboard/OccupancySection';
import RevenueSummary from '../../components/dashboard/RevenueSummary';
import RecentActivityFeed from '../../components/dashboard/RecentActivityFeed';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorState from '../../components/shared/ErrorState';
import tokens from '../../theme/tokens';

export default function DashboardScreen() {
  const { data, isLoading, isError, refetch } = useDashboardSummary();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !data) {
    return <ErrorState message="Failed to load dashboard. Pull to refresh." onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
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
    paddingBottom: tokens.spacing.xxlMd,
  },
  gap: {
    height: tokens.spacing.lgMd,
  },
});
