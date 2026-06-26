import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';
import { ScreenHeaderV2 } from '@/components/shared/ScreenHeader';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { useAuthStore } from '@/store/authStore';

import ActionRequiredCard, { PendingAction } from './components/ActionRequiredCard';
import RecentBroadcastCard, { Broadcast } from './components/RecentBroadcastCard';
import CreateCampaignModal from './components/CreateCampaignModal/CreateCampaignModal';
import { useCampaigns } from '@/hooks/campaigns/useCampaigns';
import { LoadingSpinner, ErrorState } from '@/components/shared';
import type { Campaign } from '@/types/campaign';

const TABS = [
  { id: 'broadcasts', label: 'Broadcasts' },
  { id: 'automations', label: 'Automations' },
];

function mapCampaignToPendingAction(c: Campaign): PendingAction {
  let audienceStr = `${c.recipientCount} Guests`;
  if (c.filters?.tier) {
    audienceStr += ` • ${c.filters.tier}`;
  } else if (c.filters?.property) {
    audienceStr += ` • ${c.filters.property}`;
  }

  return {
    id: c._id,
    title: c.name,
    audience: audienceStr,
    creator: c.createdBy,
    status: c.status,
  };
}

function mapCampaignToBroadcast(c: Campaign): Broadcast {
  let dateStr = c.scheduledAt || c.sentAt || '';
  if (dateStr && dateStr.includes('T')) {
    // Simple format '2026-06-15T09:00:00Z' -> '15 Jun, 09:00 AM'
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const time = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
    dateStr = `${day} ${month}, ${time}`;
  }
  return {
    id: c._id,
    title: c.name,
    status: c.status === 'sent' ? 'Sent' : 'Scheduled',
    audienceCount: c.recipientCount,
    dateStr,
  };
}

// ─── Screen Component ────────────────────────────────────────────────────────

export default function CampaignDashboardScreen() {
  const [activeTab, setActiveTab] = useState('broadcasts');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const user = useAuthStore(state => state.user);
  const insets = useSafeAreaInsets();

  const { data: campaigns, isLoading, isError, error, refetch } = useCampaigns();

  const isOwner = user?.role === 'owner';

  // Calculate bottom padding to ensure lists end above the floating tab bar
  const bottomPadding =
    tokens.navigation.height +
    tokens.navigation.paddingVertical +
    Math.max(insets.bottom, tokens.navigation.paddingVertical) +
    tokens.spacing.lg;

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <ErrorState message={error?.message || 'Failed to load campaigns.'} onRetry={refetch} />;

  const pendingCampaigns =
    campaigns?.filter(c => c.status === 'pending_approval' || c.status === 'draft') || [];
  const recentCampaigns =
    campaigns?.filter(c => c.status === 'approved' || c.status === 'sent') || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeaderV2
        title="Campaigns"
        showFilter
        showRightButton
        rightButtonText="+ New"
        onRightButtonPress={() => setIsCreateModalVisible(true)}
      />
      <View style={styles.tabsContainer}>
        <SegmentedControl tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </View>

      {activeTab === 'automations' ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Coming soon</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {isOwner && (
            <View style={styles.topSectionContainer}>
              <Text style={styles.sectionTitle}>ACTION REQUIRED</Text>
              <FlatList
                data={pendingCampaigns}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                  <ActionRequiredCard action={mapCampaignToPendingAction(item)} />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          <View style={styles.bottomSectionContainer}>
            <Text style={styles.sectionTitle}>RECENT BROADCASTS</Text>
            <FlatList
              data={recentCampaigns}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <RecentBroadcastCard broadcast={mapCampaignToBroadcast(item)} />
              )}
              contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      )}

      <CreateCampaignModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={() => refetch()}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  tabsContainer: {
    paddingHorizontal: tokens.spacing.xlMd,
    paddingBottom: tokens.spacing.lgMd,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: tokens.spacing.xlMd,
  },
  topSectionContainer: {
    paddingTop: tokens.spacing.mdLg,
    maxHeight: '50%',
  },
  bottomSectionContainer: {
    flex: 1,
    paddingTop: tokens.spacing.mdLg,
  },
  sectionTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.sectionLabel,
    fontWeight: '700',
    color: tokens.colors.textSecondary,
    letterSpacing: tokens.typography.letterSpacing.sectionLabel,
    marginBottom: tokens.spacing.mdLg,
  },
  listContent: {
    paddingBottom: tokens.spacing.xxl,
  },
});
