import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';

export default function GuestRewards() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No active rewards.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: tokens.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
  },
});
