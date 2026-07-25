import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { SharedFormModal, ConfirmationModal } from '@/components/shared';

export interface LoyaltyFormModalProps {
  // Reward modal
  rewardModalVisible: boolean;
  isEditing: boolean;
  rewardName: string;
  rewardCost: string;
  onRewardNameChange: (text: string) => void;
  onRewardCostChange: (text: string) => void;
  onRewardSubmit: () => void;
  onRewardClose: () => void;

  // Tier modal
  tierModalVisible: boolean;
  isTierEditing: boolean;
  tierName: string;
  tierMin: string;
  onTierNameChange: (text: string) => void;
  onTierMinChange: (text: string) => void;
  onTierSubmit: () => void;
  onTierClose: () => void;

  // Error modal
  errorModalVisible: boolean;
  errorMessage: string;
  onErrorClose: () => void;
}

export default function LoyaltyFormModal({
  rewardModalVisible,
  isEditing,
  rewardName,
  rewardCost,
  onRewardNameChange,
  onRewardCostChange,
  onRewardSubmit,
  onRewardClose,
  tierModalVisible,
  isTierEditing,
  tierName,
  tierMin,
  onTierNameChange,
  onTierMinChange,
  onTierSubmit,
  onTierClose,
  errorModalVisible,
  errorMessage,
  onErrorClose,
}: LoyaltyFormModalProps) {
  return (
    <>
      {/* Add / Edit Reward Modal */}
      <SharedFormModal
        visible={rewardModalVisible}
        title={isEditing ? 'Edit Reward' : 'Add Reward'}
        buttonLabel={isEditing ? 'Save' : 'Add'}
        onClose={onRewardClose}
        onSubmit={onRewardSubmit}
      >
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Reward Name</Text>
          <TextInput
            style={styles.formInput}
            placeholder="e.g. Free Night Stay"
            placeholderTextColor={tokens.colors.textHint}
            value={rewardName}
            onChangeText={onRewardNameChange}
            autoFocus
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Point Cost</Text>
          <TextInput
            style={styles.formInput}
            placeholder="e.g. 500"
            placeholderTextColor={tokens.colors.textHint}
            value={rewardCost}
            onChangeText={onRewardCostChange}
            keyboardType="number-pad"
          />
        </View>
      </SharedFormModal>

      {/* Add / Edit Tier Modal */}
      <SharedFormModal
        visible={tierModalVisible}
        title={isTierEditing ? 'Edit Tier' : 'Add Tier'}
        buttonLabel={isTierEditing ? 'Save' : 'Add'}
        onClose={onTierClose}
        onSubmit={onTierSubmit}
      >
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Tier Name</Text>
          <TextInput
            style={styles.formInput}
            placeholder="e.g. Gold"
            placeholderTextColor={tokens.colors.textHint}
            value={tierName}
            onChangeText={onTierNameChange}
            autoFocus
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Minimum Points</Text>
          <TextInput
            style={styles.formInput}
            placeholder="e.g. 1000"
            placeholderTextColor={tokens.colors.textHint}
            value={tierMin}
            onChangeText={onTierMinChange}
            keyboardType="number-pad"
          />
        </View>
      </SharedFormModal>

      {/* Validation Error Modal */}
      <ConfirmationModal
        visible={errorModalVisible}
        onClose={onErrorClose}
        onConfirm={onErrorClose}
        title="Invalid Input"
        content={errorMessage}
        confirmLabel="Okay"
        icon={<Feather name="alert-circle" size={28} color={tokens.colors.danger} />}
        iconVariant="danger"
      />
    </>
  );
}

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: tokens.spacing.lg,
  },
  formLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: tokens.spacing.sm,
  },
  formInput: {
    height: 48,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.md,
    paddingHorizontal: tokens.spacing.md,
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
    backgroundColor: tokens.colors.surface,
  },
});
