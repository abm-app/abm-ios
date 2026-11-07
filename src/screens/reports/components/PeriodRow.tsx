import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { LiveBadge } from '@/components/shared';
import type { ReportPeriod } from '@/types/reports';

interface PeriodRowProps {
  period: ReportPeriod;
  onPress: (period: ReportPeriod) => void;
  isLast: boolean;
}

export default function PeriodRow({ period, onPress, isLast }: PeriodRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.divider]}
      activeOpacity={0.6}
      onPress={() => onPress(period)}
      accessibilityRole="button"
      accessibilityLabel={`Open report for ${period.label}`}
    >
      <View style={styles.text}>
        <Text style={styles.label}>{period.label}</Text>
        {period.subtitle && <Text style={styles.subtitle}>{period.subtitle}</Text>}
      </View>
      <View style={styles.right}>
        {period.inProgress && <LiveBadge />}
        <Feather
          name="chevron-right"
          size={tokens.iconSizes.content}
          color={tokens.colors.textMuted}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.lgMd,
  },
  divider: {
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
  },
  text: {
    flex: 1,
  },
  label: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
  },
  subtitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xxs,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
});
