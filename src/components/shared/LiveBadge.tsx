import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';

// "In progress" pill for a day, week or month that has not ended yet.
export default function LiveBadge() {
  return (
    <View style={styles.badge}>
      <View style={styles.dot} />
      <Text style={styles.text}>In progress</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xsMd,
    alignSelf: 'flex-start',
    backgroundColor: tokens.colors.successLight,
    borderRadius: tokens.borderRadius.pill,
    paddingVertical: tokens.spacing.xxsMd,
    paddingHorizontal: tokens.spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.colors.success,
  },
  text: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.badge,
    fontWeight: tokens.typography.fontWeight.semibold,
    letterSpacing: tokens.typography.letterSpacing.badge,
    color: tokens.colors.badgeLowText,
  },
});
