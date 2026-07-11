import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';

export interface FilterSectionProps {
  title: string;
  children: ReactNode;
}

export default function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.xxl,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: '600',
    color: tokens.colors.textSecondary,
    letterSpacing: tokens.typography.letterSpacing.miniStatLabel,
    marginBottom: tokens.spacing.mdLg,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
});
