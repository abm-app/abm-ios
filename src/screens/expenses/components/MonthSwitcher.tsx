import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';

interface MonthSwitcherProps {
  label: string;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function MonthSwitcher({
  label,
  canGoNext,
  onPrevious,
  onNext,
}: MonthSwitcherProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPrevious}
        style={styles.arrowButton}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Previous month"
      >
        <Feather
          name="chevron-left"
          size={tokens.iconSizes.content}
          color={tokens.colors.textPrimary}
        />
      </TouchableOpacity>

      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        onPress={onNext}
        disabled={!canGoNext}
        style={[styles.arrowButton, !canGoNext && styles.arrowDisabled]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Next month"
      >
        <Feather
          name="chevron-right"
          size={tokens.iconSizes.content}
          color={tokens.colors.textPrimary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: tokens.borderRadius.lg,
    backgroundColor: tokens.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowDisabled: {
    opacity: tokens.opacity.disabled,
  },
  label: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
  },
});
