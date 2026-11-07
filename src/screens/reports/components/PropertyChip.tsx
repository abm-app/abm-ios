import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { PROPERTY_DISPLAY_NAMES } from '@/types/audit';
import type { AuditProperty } from '@/types/audit';

interface PropertyChipProps {
  property: AuditProperty;
}

// Shown instead of the property toggle for a user scoped to a single property.
export default function PropertyChip({ property }: PropertyChipProps) {
  return (
    <View style={styles.chip}>
      <Feather name="home" size={tokens.iconSizes.content} color={tokens.colors.textPrimary} />
      <Text style={styles.text}>{PROPERTY_DISPLAY_NAMES[property]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    backgroundColor: tokens.colors.chipNeutralBg,
    borderRadius: tokens.borderRadius.pill,
    paddingVertical: tokens.spacing.sMd,
    paddingHorizontal: tokens.spacing.lg,
  },
  text: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.button,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
  },
});
