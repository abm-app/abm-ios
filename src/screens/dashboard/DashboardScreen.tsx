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
import { Backdrop } from '@/components/shared';
import { ScreenHeaderV2 } from '../../components/shared/ScreenHeader';

export default function DashboardScreen() {
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !data) {
    return <ErrorState message="Failed to load dashboard. Pull to refresh." onRetry={refetch} />;
  }

  const syncedDate = new Date(data.lastSyncedAt);
  const formattedTime = syncedDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const bottomClearance =
    Math.max(insets.bottom, tokens.navigation.paddingVertical) + tokens.navigation.height + 16;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Backdrop />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomClearance }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeaderV2
          title="Dashboard"
          subtitle={`Last synced: Today, ${formattedTime}`}
          showSearch={false}
          showFilter={false}
          showRightButton={false}
          showNotifications={true}
          notificationCount={data.unreadNotifications}
        />
        <RevenueSummary todayRevenue={data.todayRevenue} />
        <View style={styles.gap} />
        <OccupancySection occupancy={data.occupancy} />
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
