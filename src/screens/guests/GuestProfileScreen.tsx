import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { RootStackParamList } from '@/navigation/types';
import { useGuest, useUpdateGuestDnc } from '@/hooks/guests/useGuests';
import { useAuthStore } from '@/store/authStore';
import { ROOMS_DB } from '@/types/room';
import { formatDate } from '@/utils/dateUtils';

import {
  Avatar,
  ErrorState,
  LoadingSpinner,
  SegmentedControl,
  ConfirmationModal,
} from '@/components/shared';
import { Badge, Button } from '@/components/ui';
import GuestProfileHeader from './components/GuestProfileHeader';
import CommunicationLog from './components/CommunicationLog';
type Props = NativeStackScreenProps<RootStackParamList, 'GuestProfile'>;

export default function GuestProfileScreen({ route }: Props) {
  const { id } = route.params;
  const { data, isLoading, isError, error, refetch } = useGuest(id);
  const updateDncMutation = useUpdateGuestDnc();
  const [activeTab, setActiveTab] = useState('stays');

  const [dncModalVisible, setDncModalVisible] = useState(false);
  const [pendingDncValue, setPendingDncValue] = useState(false);

  const userRole = useAuthStore(s => s.user?.role);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GuestProfileHeader doNotContact={false} />
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GuestProfileHeader doNotContact={false} />
        <ErrorState message={error?.message || 'Failed to load guest'} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const { guest, bookings } = data;
  const spendableBalance = guest.spendableBalance || 0;

  const isStaff = userRole === 'staff';
  const canIssueReward = !isStaff && spendableBalance >= 2000;

  const handleDncChange = (newValue: boolean) => {
    setPendingDncValue(newValue);
    setDncModalVisible(true);
  };

  const confirmDncChange = () => {
    updateDncMutation.mutate({ id, doNotContact: pendingDncValue });
    setDncModalVisible(false);
  };

  const renderStayHistory = () => {
    if (bookings.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No stay history found.</Text>
        </View>
      );
    }

    return bookings.map((booking, index) => {
      const isLast = index === bookings.length - 1;
      const roomName = ROOMS_DB[booking.rmCode] || booking.rmCode;

      return (
        <View key={booking.id} style={styles.timelineRow}>
          <View style={styles.timelineLeft}>
            <View style={styles.timelineDot} />
            {!isLast && <View style={styles.timelineLine} />}
          </View>

          <View style={styles.timelineContent}>
            <View style={styles.stayHeader}>
              <Text style={styles.stayDate}>Checkout: {formatDate(booking.checkoutDate)}</Text>
              <Badge label={`+${booking.pointsEarned} Pts`} variant="low" />
            </View>
            <Text style={styles.roomName}>{roomName}</Text>
            <View style={styles.stayMeta}>
              <Feather
                name={booking.notes ? 'star' : 'file-text'}
                size={12}
                color={tokens.colors.textMuted}
              />
              <Text style={styles.stayMetaText}>
                {booking.notes || `Folio ${booking.folioNumber}`}
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };

  const renderRewards = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No active rewards.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <GuestProfileHeader doNotContact={guest.doNotContact} onDncChange={handleDncChange} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Avatar name={guest.name} size={64} />
          <Text style={styles.guestName}>{guest.name}</Text>
          <Text style={styles.guestPhone}>{guest.phone}</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHalf}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>AVAILABLE{'\n'}POINTS</Text>
              <View style={styles.tierBadge}>
                <Text style={styles.tierBadgeText}>{guest.tier.toUpperCase()} TIER</Text>
              </View>
            </View>
            <Text style={styles.summaryValue}>{spendableBalance.toLocaleString()}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={[styles.summaryHalf, styles.summaryHalfRight]}>
            <Text style={[styles.summaryLabel, styles.summaryLabelRight]}>TOTAL NIGHTS</Text>
            <Text style={styles.summaryValue}>{guest.totalStays}</Text>
          </View>
        </View>

        {/* Tabs */}
        <SegmentedControl
          tabs={[
            { id: 'stays', label: 'Stay History' },
            { id: 'rewards', label: 'Rewards' },
            { id: 'comms', label: 'Comms' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          style={styles.tabs}
        />

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'stays' && renderStayHistory()}
          {activeTab === 'rewards' && renderRewards()}
          {activeTab === 'comms' && (
            <CommunicationLog guestId={guest._id} doNotContact={guest.doNotContact} />
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Button
          label="ISSUE REWARD"
          icon={isStaff ? 'lock' : 'plus'}
          onPress={() => {}}
          disabled={isStaff || !canIssueReward}
          style={styles.actionButton}
        />
      </View>

      <ConfirmationModal
        visible={dncModalVisible}
        onClose={() => setDncModalVisible(false)}
        onConfirm={confirmDncChange}
        title={pendingDncValue ? 'Enable Do Not Contact?' : 'Disable Do Not Contact?'}
        content={
          pendingDncValue
            ? 'This will prevent marketing and promotional communications to this guest.'
            : 'The guest will begin receiving promotional communications again.'
        }
        confirmLabel={pendingDncValue ? 'Enable DNC' : 'Disable DNC'}
        iconVariant={pendingDncValue ? 'danger' : 'success'}
        icon={
          <Feather
            name={pendingDncValue ? 'slash' : 'check'}
            size={32}
            color={pendingDncValue ? tokens.colors.danger : tokens.colors.success}
          />
        }
        confirmDisabled={updateDncMutation.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  scrollContent: {
    paddingBottom: tokens.spacing.xxxl,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.lg,
  },
  guestName: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.h1,
    color: tokens.colors.textPrimary,
    marginTop: tokens.spacing.md,
  },
  guestPhone: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xs,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.cardDarkBg,
    marginHorizontal: tokens.spacing.xlMd,
    borderRadius: tokens.borderRadius.xl,
    padding: tokens.spacing.xl,
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.xxl,
  },
  summaryHalf: {
    flex: 1,
    justifyContent: 'center',
  },
  summaryHalfRight: {
    alignItems: 'flex-end',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  summaryLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 10,
    color: tokens.colors.textHint,
    letterSpacing: 0.5,
    marginRight: tokens.spacing.md,
  },
  summaryLabelRight: {
    textAlign: 'right',
  },
  tierBadge: {
    backgroundColor: tokens.colors.badgeSuiteBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierBadgeText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 9,
    color: tokens.colors.badgeSuiteText,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 32,
    color: tokens.colors.white,
    fontWeight: '400',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: tokens.colors.textSecondary,
    marginHorizontal: tokens.spacing.lg,
  },
  tabs: {
    marginBottom: tokens.spacing.xl,
  },
  tabContent: {
    paddingHorizontal: tokens.spacing.xlMd,
  },
  emptyContainer: {
    padding: tokens.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.md,
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
    marginRight: tokens.spacing.sm,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.textPrimary,
    marginTop: 6,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: tokens.colors.border,
    marginTop: tokens.spacing.sm,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: tokens.colors.surfaceLight,
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.lg,
  },
  stayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  stayDate: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textSecondary,
    fontWeight: '500',
  },
  roomName: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.sm,
  },
  stayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stayMetaText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginLeft: tokens.spacing.s,
  },
  bottomBar: {
    paddingHorizontal: tokens.spacing.xlMd,
    paddingVertical: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xxxl,
    borderTopWidth: tokens.borderWidth.hairline,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.background,
  },
  actionButton: {
    width: '100%',
  },
});
