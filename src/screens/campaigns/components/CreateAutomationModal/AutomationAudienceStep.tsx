import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import tokens from '@/theme/tokens';
import { Input, Chip } from '@/components/ui';

interface AutomationAudienceStepProps {
  name: string;
  onChangeName: (val: string) => void;
  selectedTiers: string[];
  onToggleTier: (tier: string) => void;
  reachCount: number | null;
  isLoadingReach: boolean;
  tierOptions: string[];
}

export default function AutomationAudienceStep({
  name,
  onChangeName,
  selectedTiers,
  onToggleTier,
  reachCount,
  isLoadingReach,
  tierOptions,
}: AutomationAudienceStepProps) {
  return (
    <View>
      <Input
        label="Automation Name"
        placeholder="e.g. Thank you after stay"
        value={name}
        onChangeText={onChangeName}
        style={styles.field}
      />

      <Text style={styles.subLabel}>GUEST TIERS</Text>
      <View style={styles.chipGroup}>
        {tierOptions.map(tier => (
          <Chip
            key={tier}
            label={tier}
            active={selectedTiers.includes(tier)}
            tone="primary"
            onPress={() => onToggleTier(tier)}
          />
        ))}
      </View>

      <View style={styles.reachCard}>
        <Text style={styles.reachText}>ESTIMATED REACH</Text>
        {isLoadingReach ? (
          <ActivityIndicator size="small" color={tokens.colors.primary} />
        ) : (
          <Text style={styles.reachNumber}>~{reachCount ?? 0} Guests</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: tokens.spacing.mdLg,
    fontFamily: tokens.typography.fontFamily.sub,
  },
  subLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: '500',
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.sm,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.mdLg,
  },
  reachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.lg,
    marginTop: tokens.spacing.md,
  },
  reachText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: '600',
    color: tokens.colors.textMuted,
  },
  reachNumber: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
});
