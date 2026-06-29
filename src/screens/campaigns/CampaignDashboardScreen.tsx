import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';
import { ScreenHeaderV2 } from '@/components/shared/ScreenHeader';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { useAuthStore } from '@/store/authStore';

import ActionRequiredCard, { PendingAction } from './components/ActionRequiredCard';
import RecentBroadcastCard, { Broadcast } from './components/RecentBroadcastCard';
import CreateCampaignModal from './components/CreateCampaignModal/CreateCampaignModal';
import { useCampaigns } from '@/hooks/campaigns/useCampaigns';
import { LoadingSpinner, ErrorState, Backdrop, Accordion } from '@/components/shared';
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
  let dateStr = c.scheduledAt || c.sentAt || c.createdAt || '';
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
    status: c.status.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase()),
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

  const pendingCampaigns = campaigns?.filter(c => c.status === 'pending_approval') || [];
  const recentCampaigns = campaigns?.filter(c => c.status !== 'pending_approval') || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Backdrop />
      <ScreenHeaderV2
        title="Campaigns"
        showFilter
        showRightButton={user?.role !== 'staff'}
        rightButtonText="+ New"
        onRightButtonPress={() => setIsCreateModalVisible(true)}
      />
      <View style={[styles.mainWrapper, { paddingBottom: bottomPadding }]}>
        <View style={styles.surface}>
          <View style={styles.tabsContainer}>
            <SegmentedControl tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollInner}
          >
            {activeTab === 'automations' ? (
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>Coming soon</Text>
              </View>
            ) : (
              <View style={styles.contentContainer}>
                {isOwner && pendingCampaigns.length > 0 && (
                  <Accordion title="Pending Approval" count={pendingCampaigns.length}>
                    {pendingCampaigns.map(item => (
                      <ActionRequiredCard
                        key={item._id}
                        action={mapCampaignToPendingAction(item)}
                      />
                    ))}
                  </Accordion>
                )}

                <Accordion title="Recent Broadcasts">
                  {recentCampaigns.map(item => (
                    <RecentBroadcastCard key={item._id} broadcast={mapCampaignToBroadcast(item)} />
                  ))}
                </Accordion>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

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
  },
  mainWrapper: {
    flex: 1,
    paddingHorizontal: tokens.spacing.xlMd,
    paddingTop: tokens.spacing.md,
  },
  scrollInner: {
    flexGrow: 1,
  },
  surface: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.borderRadius.xl,
    padding: tokens.spacing.xlMd,
    shadowColor: tokens.shadow.modal.shadowColor,
    shadowOffset: tokens.shadow.modal.shadowOffset,
    shadowOpacity: tokens.shadow.modal.shadowOpacity,
    shadowRadius: tokens.shadow.modal.shadowRadius,
    elevation: 2,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
  },
  tabsContainer: {
    paddingBottom: tokens.spacing.lgMd,
  },
  centerContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
  },
  contentContainer: {
    paddingTop: tokens.spacing.md,
  },
});
