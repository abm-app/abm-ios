import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';
import { ScreenHeaderV2 } from '@/components/shared/ScreenHeader';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { useAuthStore } from '@/store/authStore';

import ActionRequiredCard, { PendingAction } from './components/ActionRequiredCard';
import RecentBroadcastCard, { Broadcast } from './components/RecentBroadcastCard';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const PENDING_ACTIONS: PendingAction[] = [
  {
    id: '1',
    title: 'Monsoon Flash Sale',
    audience: '850 Guests • Suites & Execs',
    creator: 'Sarah J.',
  },
];

const RECENT_BROADCASTS: Broadcast[] = [
  {
    id: '1',
    title: 'Diwali Early Access',
    status: 'Scheduled',
    audienceCount: 1200,
    dateStr: '10 Nov, 09:00 AM',
  },
  {
    id: '2',
    title: 'Weekend Upgrade Offer',
    status: 'Sent',
    audienceCount: 620,
    dateStr: '17 Nov, 12:00 AM',
  },
];

const TABS = [
  { id: 'broadcasts', label: 'Broadcasts' },
  { id: 'automations', label: 'Automations' },
];

// ─── Screen Component ────────────────────────────────────────────────────────

export default function CampaignDashboardScreen() {
  const [activeTab, setActiveTab] = useState('broadcasts');
  const user = useAuthStore(state => state.user);
  const insets = useSafeAreaInsets();

  const isOwner = user?.role === 'owner';

  // Calculate bottom padding to ensure lists end above the floating tab bar
  const bottomPadding =
    tokens.navigation.height +
    tokens.navigation.paddingVertical +
    Math.max(insets.bottom, tokens.navigation.paddingVertical) +
    tokens.spacing.lg;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeaderV2 title="Campaigns" showFilter showRightButton rightButtonText="+ New" />

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
                data={PENDING_ACTIONS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ActionRequiredCard action={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          <View style={styles.bottomSectionContainer}>
            <Text style={styles.sectionTitle}>RECENT BROADCASTS</Text>
            <FlatList
              data={RECENT_BROADCASTS}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <RecentBroadcastCard broadcast={item} />}
              contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      )}
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
