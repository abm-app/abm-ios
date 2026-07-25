import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MenuStackParamList } from '@/navigation/types';

import tokens from '@/theme/tokens';
import { ScreenHeaderV2 } from '@/components/shared/ScreenHeader';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { Backdrop, ListSurface, LoadingSpinner, ErrorState } from '@/components/shared';
import { useLoyaltyConfig, useUpdateLoyaltyConfig } from '@/hooks/loyalty/useLoyaltyConfig';
import type { TierThreshold, RewardCatalogItem } from '@/types/loyalty';
import RewardsTab, { RewardsTabHandle } from './components/RewardsList';
import TiersTab, { TiersTabHandle } from './components/TiersList';
import LoyaltyFormModal from './components/LoyaltyFormModal';

const TABS = [
  { id: 'rewards', label: 'Rewards' },
  { id: 'tiers', label: 'Tiers' },
];

// ── Main Screen ─────────────────────────────────────────────────────────────

export default function LoyaltyConfigScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<MenuStackParamList>>();
  const [activeTab, setActiveTab] = useState('rewards');
  const { data, isLoading, isError, error, refetch } = useLoyaltyConfig();
  const { mutate: updateConfig } = useUpdateLoyaltyConfig();
  const rewardsTabRef = useRef<RewardsTabHandle>(null);
  const tiersTabRef = useRef<TiersTabHandle>(null);

  // ── Reward Add / Edit modal state ────────────────────────────────────────
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');

  // ── Tier Add / Edit modal state ──────────────────────────────────────────
  const [tierModalVisible, setTierModalVisible] = useState(false);
  const [tierEditingIndex, setTierEditingIndex] = useState<number | null>(null);
  const [newTierName, setNewTierName] = useState('');
  const [newTierMin, setNewTierMin] = useState('');

  // ── Error modal state ────────────────────────────────────────────────────
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = editingIndex !== null;
  const isTierEditing = tierEditingIndex !== null;

  const bottomPadding =
    tokens.navigation.height +
    tokens.navigation.paddingVertical +
    Math.max(insets.bottom, tokens.navigation.paddingVertical) +
    tokens.spacing.lg;

  const handleOpenAddModal = useCallback(() => {
    setEditingIndex(null);
    setNewName('');
    setNewCost('');
    setAddModalVisible(true);
  }, []);

  const handleOpenEditModal = useCallback((_index: number, item: RewardCatalogItem) => {
    setEditingIndex(_index);
    setNewName(item.name);
    setNewCost(String(item.cost));
    setAddModalVisible(true);
  }, []);

  const handleSubmitReward = useCallback(() => {
    const trimmedName = newName.trim();
    const cost = parseInt(newCost, 10);

    if (!trimmedName || Number.isNaN(cost) || cost < 0) {
      setErrorMessage('Please enter a valid name and point cost.');
      setErrorModalVisible(true);
      return;
    }

    if (isEditing && editingIndex !== null) {
      rewardsTabRef.current?.updateItem(editingIndex, trimmedName, cost);
    } else {
      rewardsTabRef.current?.addItem(trimmedName, cost);
    }

    setNewName('');
    setNewCost('');
    setEditingIndex(null);
    setAddModalVisible(false);
  }, [newName, newCost, isEditing, editingIndex]);

  const handleAutoSaveRewards = useCallback(
    (rewards: RewardCatalogItem[]) => {
      updateConfig(
        {
          rewardCatalog: rewards.map(({ id, name, cost }) => ({ id: id || undefined, name, cost })),
        },
        {
          onError: err => {
            setErrorMessage(err.message || 'Failed to update rewards.');
            setErrorModalVisible(true);
          },
        },
      );
    },
    [updateConfig],
  );

  // ── Tier modal handlers ────────────────────────────────────────────────────

  const handleOpenAddTierModal = useCallback(() => {
    setTierEditingIndex(null);
    setNewTierName('');
    setNewTierMin('');
    setTierModalVisible(true);
  }, []);

  const handleOpenEditTierModal = useCallback((_index: number, item: TierThreshold) => {
    setTierEditingIndex(_index);
    setNewTierName(item.name);
    setNewTierMin(String(item.minPoints));
    setTierModalVisible(true);
  }, []);

  const handleSubmitTier = useCallback(() => {
    const trimmedName = newTierName.trim();
    const min = parseInt(newTierMin, 10);

    if (!trimmedName || Number.isNaN(min) || min < 0) {
      setErrorMessage('Please enter a valid tier name and minimum points.');
      setErrorModalVisible(true);
      return;
    }

    if (isTierEditing && tierEditingIndex !== null) {
      tiersTabRef.current?.updateItem(tierEditingIndex, trimmedName, min);
    } else {
      tiersTabRef.current?.addItem(trimmedName, min);
    }

    setNewTierName('');
    setNewTierMin('');
    setTierEditingIndex(null);
    setTierModalVisible(false);
  }, [newTierName, newTierMin, isTierEditing, tierEditingIndex]);

  const handleAutoSaveTiers = useCallback(
    (tiers: TierThreshold[]) => {
      updateConfig(
        { tierThresholds: tiers },
        {
          onError: err => {
            setErrorMessage(err.message || 'Failed to update tiers.');
            setErrorModalVisible(true);
          },
        },
      );
    },
    [updateConfig],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Backdrop />
      <ScreenHeaderV2
        title="Loyalty Config"
        showRightButton={activeTab === 'rewards' || activeTab === 'tiers'}
        rightButtonText={activeTab === 'rewards' ? 'Add Reward' : 'Add Tier'}
        onRightButtonPress={activeTab === 'rewards' ? handleOpenAddModal : handleOpenAddTierModal}
        showNotifications={false}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <View style={[styles.mainWrapper, { paddingBottom: bottomPadding }]}>
        <ListSurface>
          <View style={styles.tabsContainer}>
            <SegmentedControl tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
          </View>

          {isLoading ? (
            <View style={styles.center}>
              <LoadingSpinner />
            </View>
          ) : isError ? (
            <View style={styles.center}>
              <ErrorState
                message={error?.message ?? 'Failed to load loyalty config.'}
                onRetry={refetch}
              />
            </View>
          ) : !data ? null : activeTab === 'rewards' ? (
            <RewardsTab
              ref={rewardsTabRef}
              rewards={data.rewardCatalog}
              onSave={handleAutoSaveRewards}
              onEditItem={handleOpenEditModal}
            />
          ) : (
            <TiersTab
              ref={tiersTabRef}
              tiers={data.tierThresholds}
              onSave={handleAutoSaveTiers}
              onEditItem={handleOpenEditTierModal}
            />
          )}
        </ListSurface>
      </View>

      <LoyaltyFormModal
        rewardModalVisible={addModalVisible}
        isEditing={isEditing}
        rewardName={newName}
        rewardCost={newCost}
        onRewardNameChange={setNewName}
        onRewardCostChange={setNewCost}
        onRewardSubmit={handleSubmitReward}
        onRewardClose={() => {
          setAddModalVisible(false);
          setEditingIndex(null);
        }}
        tierModalVisible={tierModalVisible}
        isTierEditing={isTierEditing}
        tierName={newTierName}
        tierMin={newTierMin}
        onTierNameChange={setNewTierName}
        onTierMinChange={setNewTierMin}
        onTierSubmit={handleSubmitTier}
        onTierClose={() => {
          setTierModalVisible(false);
          setTierEditingIndex(null);
        }}
        errorModalVisible={errorModalVisible}
        errorMessage={errorMessage}
        onErrorClose={() => setErrorModalVisible(false)}
      />
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
    paddingHorizontal: tokens.spacing.xlMd,
    paddingTop: tokens.spacing.md,
  },
  tabsContainer: {
    paddingBottom: tokens.spacing.lgMd,
  },
  center: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
