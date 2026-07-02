import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { SharedFormModal, LoadingSpinner, ErrorState } from '@/components/shared';
import { useRewardCatalogue } from '@/hooks/rewards/useRewardCatalogue';

interface IssueRewardModalProps {
  visible: boolean;
  onClose: () => void;
  spendableBalance: number;
  onIssueReward: (rewardId: string, cost: number) => void;
}

export default function IssueRewardModal({
  visible,
  onClose,
  spendableBalance,
  onIssueReward,
}: IssueRewardModalProps) {
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);

  const { data: catalogue, isLoading, isError, refetch } = useRewardCatalogue();

  const sortedRewards = useMemo(() => {
    if (!catalogue) return [];
    return [...catalogue].sort((a, b) => {
      const aAffordable = a.pointsCost <= spendableBalance;
      const bAffordable = b.pointsCost <= spendableBalance;
      if (aAffordable && !bAffordable) return -1;
      if (!aAffordable && bAffordable) return 1;
      return a.pointsCost - b.pointsCost;
    });
  }, [catalogue, spendableBalance]);

  const handleSubmit = () => {
    if (!selectedRewardId || !catalogue) return;
    const reward = catalogue.find(r => r.id === selectedRewardId);
    if (reward) {
      onIssueReward(reward.id, reward.pointsCost);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedRewardId(null);
    onClose();
  };

  const selectedReward = catalogue?.find(r => r.id === selectedRewardId);
  const isValidSelection = !!selectedReward && selectedReward.pointsCost <= spendableBalance;

  return (
    <SharedFormModal
      visible={visible}
      title="Issue Reward"
      buttonLabel="Issue Reward"
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitDisabled={!isValidSelection}
    >
      {isLoading && <LoadingSpinner />}
      {isError && <ErrorState message="Failed to load rewards" onRetry={refetch} />}
      {!isLoading && !isError && catalogue && (
        <View style={styles.listContainer}>
          {sortedRewards.map(reward => {
            const isAffordable = reward.pointsCost <= spendableBalance;
            const isSelected = selectedRewardId === reward.id;

            return (
              <TouchableOpacity
                key={reward.id}
                activeOpacity={0.7}
                disabled={!isAffordable}
                onPress={() => setSelectedRewardId(reward.id)}
                style={[
                  styles.rewardRow,
                  isSelected && styles.rewardRowSelected,
                  !isAffordable && styles.rewardRowDisabled,
                ]}
              >
                <View style={styles.rewardInfo}>
                  <Text
                    style={[
                      styles.rewardName,
                      isSelected && styles.rewardNameSelected,
                      !isAffordable && styles.textDisabled,
                    ]}
                  >
                    {reward.name}
                  </Text>
                </View>

                <View style={styles.costContainer}>
                  <Text
                    style={[
                      styles.rewardCost,
                      isSelected && styles.rewardCostSelected,
                      !isAffordable && styles.textDisabled,
                    ]}
                  >
                    {reward.pointsCost.toLocaleString()} pts
                  </Text>
                  {isSelected && (
                    <Feather
                      name="check-circle"
                      size={20}
                      color={tokens.colors.primary}
                      style={styles.checkIcon}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </SharedFormModal>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: tokens.spacing.md,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.md,
    backgroundColor: tokens.colors.surfaceLight,
    marginBottom: tokens.spacing.md,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
  },
  rewardRowSelected: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.surfaceLight,
  },
  rewardRowDisabled: {
    backgroundColor: tokens.colors.surface,
    opacity: tokens.opacity.disabled,
  },
  rewardInfo: {
    flex: 1,
    paddingRight: tokens.spacing.md,
  },
  rewardName: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
    fontWeight: '600',
  },
  rewardNameSelected: {
    color: tokens.colors.primary,
  },
  textDisabled: {
    color: tokens.colors.textMuted,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardCost: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textSecondary,
    fontWeight: '500',
  },
  rewardCostSelected: {
    color: tokens.colors.primary,
  },
  checkIcon: {
    marginLeft: tokens.spacing.sm,
  },
});
