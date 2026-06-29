import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import tokens from '@/theme/tokens';
import { Input, Chip } from '@/components/ui';

interface TargetAudienceStepProps {
  name: string;
  onChangeName: (val: string) => void;
  scheduledAt: string;
  offerExpiry: string;
  selectedTiers: string[];
  onToggleTier: (tier: string) => void;
  reachCount: number | null;
  isLoadingReach: boolean;
  onOpenCalendar: (target: 'start' | 'end') => void;
}

const GUEST_TIERS = ['All', 'Standard', 'Deluxe', 'Executive', 'Suite'];

export default function TargetAudienceStep({
  name,
  onChangeName,
  scheduledAt,
  offerExpiry,
  selectedTiers,
  onToggleTier,
  reachCount,
  isLoadingReach,
  onOpenCalendar,
}: TargetAudienceStepProps) {
  const formatDate = (isoStr?: string) => {
    if (!isoStr) return null;
    const [year, month, day] = isoStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <View>
      <Input
        label="Campaign Name"
        placeholder="e.g. Summer VIP Offer"
        value={name}
        onChangeText={onChangeName}
        style={styles.field}
      />

      <View style={styles.dateRow}>
        <View style={styles.dateCol}>
          <Text style={styles.inputLabel}>Start Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => onOpenCalendar('start')}
            activeOpacity={0.7}
          >
            <Text style={scheduledAt ? styles.dateText : styles.datePlaceholder}>
              {formatDate(scheduledAt) || 'Select Date'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateCol}>
          <Text style={styles.inputLabel}>End Date (Optional)</Text>
          <TouchableOpacity
            style={[styles.dateInput, !scheduledAt && styles.dateInputDisabled]}
            onPress={() => onOpenCalendar('end')}
            activeOpacity={0.7}
            disabled={!scheduledAt}
          >
            <Text style={offerExpiry ? styles.dateText : styles.datePlaceholder}>
              {formatDate(offerExpiry) || 'Select Date'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subLabel}>GUEST TIERS</Text>
      <View style={styles.chipGroup}>
        {GUEST_TIERS.map(tier => (
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
          <Text style={styles.reachNumber}>~{reachCount} Guests</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: '600',
    color: tokens.colors.textHint,
    letterSpacing: 1,
    marginBottom: tokens.spacing.md,
  },
  subLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: '500',
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.sm,
  },
  field: {
    marginBottom: tokens.spacing.mdLg,
    fontFamily: tokens.typography.fontFamily.sub,
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
  dateRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.mdLg,
  },
  dateCol: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: '600',
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.sm,
  },
  dateInput: {
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.borderMd,
    borderRadius: tokens.borderRadius.md,
    paddingHorizontal: tokens.spacing.md,
    height: 44,
    justifyContent: 'center',
    backgroundColor: tokens.colors.background,
  },
  dateInputDisabled: {
    opacity: 0.5,
    backgroundColor: tokens.colors.surface,
  },
  dateText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
  },
  datePlaceholder: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textHint,
  },
});
