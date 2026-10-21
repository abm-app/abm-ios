import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { PROPERTY_DISPLAY_NAMES } from '@/types/audit';
import type { PettyCashEntry } from '@/types/expense';
import { formatDate, formatTimeIST } from '@/utils/dateUtils';
import { formatRupees } from '@/utils/formatters';

interface PettyCashRowProps {
  entry: PettyCashEntry;
  showProperty: boolean;
  isLast?: boolean;
}

// Read-only: petty cash is entered in Atithi, so the app only shows it.
export default function PettyCashRow({ entry, showProperty, isLast }: PettyCashRowProps) {
  const isSpent = entry.expense > 0;
  const amount = isSpent ? `-${formatRupees(entry.expense)}` : `+${formatRupees(entry.income)}`;

  const details = [
    formatDate(entry.date) ?? entry.date,
    formatTimeIST(entry.occurredAt ?? undefined),
    entry.userName,
    ...(showProperty ? [PROPERTY_DISPLAY_NAMES[entry.property]] : []),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={[styles.container, !isLast && styles.borderBottom]}>
      <View style={styles.leftContent}>
        <Text style={styles.description} numberOfLines={2}>
          {entry.description || 'No description'}
        </Text>
        <Text style={styles.details} numberOfLines={1}>
          {details}
        </Text>
      </View>
      <Text style={[styles.amount, !isSpent && styles.received]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.xl,
    backgroundColor: tokens.colors.white,
  },
  borderBottom: {
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
  },
  leftContent: {
    flex: 1,
    marginRight: tokens.spacing.md,
  },
  description: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
  },
  details: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xs,
  },
  amount: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
  },
  received: {
    color: tokens.colors.success,
  },
});
