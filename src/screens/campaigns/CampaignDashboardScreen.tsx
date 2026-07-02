import React, { useState } from 'react';
import { View, Text, StyleSheet, SectionList, LayoutAnimation, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';
import { ScreenHeaderV2 } from '@/components/shared/ScreenHeader';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { useAuthStore } from '@/store/authStore';

import ActionRequiredCard, { PendingAction } from './components/ActionRequiredCard';
import RecentBroadcastCard, { Broadcast } from './components/RecentBroadcastCard';
import CreateCampaignModal from './components/CreateCampaignModal/CreateCampaignModal';
import { useCampaigns } from '@/hooks/campaigns/useCampaigns';
import { LoadingSpinner, ErrorState, Backdrop, EmptyState, ListSurface } from '@/components/shared';
import { AccordionHeader } from './components/Accordion';
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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    pending: true,
    recent: true,
  });
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
        <ListSurface>
          <View style={styles.tabsContainer}>
            <SegmentedControl tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
          </View>

          {activeTab === 'automations' ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollInner}
            >
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>Coming soon</Text>
              </View>
            </ScrollView>
          ) : (
            <SectionList
              sections={[
                ...(isOwner && pendingCampaigns.length > 0
                  ? [
                      {
                        key: 'pending',
                        title: 'Pending Approval',
                        count: pendingCampaigns.length,
                        data: expandedSections.pending ? pendingCampaigns : [],
                        renderItem: ({ item }: { item: Campaign }) => (
                          <ActionRequiredCard action={mapCampaignToPendingAction(item)} />
                        ),
                      },
                    ]
                  : []),
                ...(recentCampaigns.length > 0
                  ? [
                      {
                        key: 'recent',
                        title: 'Recent Broadcasts',
                        data: expandedSections.recent ? recentCampaigns : [],
                        renderItem: ({ item }: { item: Campaign }) => (
                          <RecentBroadcastCard broadcast={mapCampaignToBroadcast(item)} />
                        ),
                      },
                    ]
                  : []),
              ]}
              keyExtractor={item => item._id}
              ListEmptyComponent={
                <EmptyState
                  icon="list"
                  title="No Campaigns"
                  subtitle="You don't have any pending or recent campaigns yet."
                />
              }
              renderSectionHeader={({ section }) => (
                <AccordionHeader
                  title={section.title}
                  count={section.count}
                  expanded={!!expandedSections[section.key]}
                  onToggle={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setExpandedSections(prev => ({
                      ...prev,
                      [section.key]: !prev[section.key],
                    }));
                  }}
                />
              )}
              contentContainerStyle={styles.scrollInner}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={false}
            />
          )}
        </ListSurface>
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
  tabsContainer: {
    paddingBottom: tokens.spacing.lgMd,
  },
  centerContainer: {
    minHeight: tokens.emptyState.minHeight,
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
