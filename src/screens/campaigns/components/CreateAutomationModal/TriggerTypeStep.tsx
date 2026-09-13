import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { Input } from '@/components/ui';
import type { TriggerType } from '@/types/campaign';

interface TriggerOption {
  type: TriggerType;
  title: string;
  description: string;
}

const TRIGGER_OPTIONS: TriggerOption[] = [
  {
    type: 'post_checkout',
    title: 'Right after checkout',
    description: 'Sends as soon as a guest checks out.',
  },
  {
    type: 'days_since_visit',
    title: 'Days after visit',
    description: 'Sends a set number of days after a guest’s last stay.',
  },
  {
    type: 'tier_upgrade',
    title: 'On tier upgrade',
    description: 'Sends whenever a guest moves up a loyalty tier.',
  },
];

interface TriggerTypeStepProps {
  triggerType: TriggerType | null;
  onChangeTriggerType: (type: TriggerType) => void;
  days: string;
  onChangeDays: (val: string) => void;
  locked?: boolean;
}

export default function TriggerTypeStep({
  triggerType,
  onChangeTriggerType,
  days,
  onChangeDays,
  locked,
}: TriggerTypeStepProps) {
  return (
    <View>
      <Text style={styles.sectionLabel}>WHEN SHOULD THIS SEND?</Text>
      <View style={styles.optionGroup}>
        {TRIGGER_OPTIONS.map(option => {
          const isActive = triggerType === option.type;
          return (
            <TouchableOpacity
              key={option.type}
              style={[styles.optionCard, isActive && styles.optionCardActive]}
              onPress={() => !locked && onChangeTriggerType(option.type)}
              activeOpacity={locked ? 1 : 0.7}
              disabled={locked && !isActive}
            >
              <View style={styles.optionTextWrap}>
                <Text style={[styles.optionTitle, isActive && styles.optionTitleActive]}>
                  {option.title}
                </Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              {isActive && (
                <Feather
                  name="check-circle"
                  size={tokens.iconSizes.content}
                  color={tokens.colors.primary}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {locked && (
        <Text style={styles.lockedHint}>
          The trigger can’t be changed after an automation is created — create a new automation
          instead.
        </Text>
      )}

      {triggerType === 'days_since_visit' && (
        <Input
          label="Days After Visit"
          placeholder="e.g. 30"
          value={days}
          onChangeText={onChangeDays}
          keyboardType="number-pad"
          style={styles.daysInput}
        />
      )}
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
  optionGroup: {
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.mdLg,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.lg,
    paddingVertical: tokens.spacing.lgMd,
    paddingHorizontal: tokens.spacing.lg,
    backgroundColor: tokens.colors.background,
  },
  optionCardActive: {
    borderColor: tokens.colors.primary,
  },
  optionTextWrap: {
    flex: 1,
    marginRight: tokens.spacing.md,
  },
  optionTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
  },
  optionTitleActive: {
    color: tokens.colors.primary,
  },
  optionDescription: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
  lockedHint: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.mdLg,
  },
  daysInput: {
    marginTop: tokens.spacing.sm,
    fontFamily: tokens.typography.fontFamily.sub,
  },
});
