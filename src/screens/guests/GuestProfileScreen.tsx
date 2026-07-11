import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { RootStackParamList } from '@/navigation/types';
import { useGuest, useUpdateGuestDnc } from '@/hooks/guests/useGuests';
import { useAuthStore } from '@/store/authStore';
import { useIssueGuestReward } from '@/hooks/rewards/useGuestRewards';
import {
  ErrorState,
  LoadingSpinner,
  SegmentedControl,
  ConfirmationModal,
} from '@/components/shared';
import { Button } from '@/components/ui';
import GuestProfileHeader from './components/GuestProfileHeader';
import CommunicationLog from './components/CommunicationLog';
import GuestStayHistory from './components/GuestStayHistory';
import GuestSummaryCard from './components/GuestSummaryCard';
import GuestProfileInfo from './components/GuestProfileInfo';
import GuestRewards from './components/GuestRewards';
import IssueRewardModal from './components/IssueRewardModal';
type Props = NativeStackScreenProps<RootStackParamList, 'GuestProfile'>;

export default function GuestProfileScreen({ route }: Props) {
  const { id } = route.params;
  const { data, isLoading, isError, error, refetch } = useGuest(id);
  const updateDncMutation = useUpdateGuestDnc();
  const issueRewardMutation = useIssueGuestReward(id);
  const [activeTab, setActiveTab] = useState('stays');

  const [rewardModalVisible, setRewardModalVisible] = useState(false);

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

  const guest = data;
  const spendableBalance = guest.spendableBalance || 0;

  const isStaff = userRole === 'staff';

  const handleDncChange = (newValue: boolean) => {
    setPendingDncValue(newValue);
    setDncModalVisible(true);
  };

  const confirmDncChange = () => {
    updateDncMutation.mutate({ id, doNotContact: pendingDncValue });
    setDncModalVisible(false);
  };

  const handleIssueReward = (_rewardId: string, _cost: number) => {
    issueRewardMutation.mutate(_rewardId);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <GuestProfileHeader doNotContact={guest.doNotContact} onDncChange={handleDncChange} />

      <View style={styles.topSection}>
        <GuestProfileInfo name={guest.name} phone={guest.phone} />

        <GuestSummaryCard
          spendableBalance={spendableBalance}
          tier={guest.tier}
          totalStays={guest.totalStays}
        />

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
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'stays' && <GuestStayHistory bookings={[]} />}
          {activeTab === 'rewards' && <GuestRewards guestId={guest.id} />}
          {activeTab === 'comms' && (
            <CommunicationLog guestId={guest.id} doNotContact={guest.doNotContact} />
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Button
          label="ISSUE REWARD"
          icon={isStaff ? 'lock' : 'plus'}
          onPress={() => setRewardModalVisible(true)}
          disabled={isStaff}
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

      <IssueRewardModal
        visible={rewardModalVisible}
        onClose={() => setRewardModalVisible(false)}
        spendableBalance={spendableBalance}
        onIssueReward={handleIssueReward}
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
  topSection: {
    backgroundColor: tokens.colors.background,
    zIndex: 10,
  },

  tabs: {
    marginBottom: tokens.spacing.xl,
  },
  tabContent: {
    paddingHorizontal: tokens.spacing.xlMd,
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
