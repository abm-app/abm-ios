import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import { EMPTY_VALUE, formatCount } from '@/utils/formatters';

export interface DetailRow {
  label: string;
  // Null means the backend has not synced it yet: shown as a dash, never as zero.
  value: number | null;
}

interface DetailRowsCardProps {
  title: string;
  // Unit of the figures ("guests", "room-nights"), shown beside the title.
  unit?: string;
  rows: DetailRow[];
}

export default function DetailRowsCard({ title, unit, rows }: DetailRowsCardProps) {
  return (
    <Card variant="shadow-outlined" shadow="elevatedCard" padded style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      {rows.map((row, index) => (
        <View key={row.label} style={[styles.row, index > 0 && styles.rowDivider]}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={[styles.value, row.value === null && styles.valueEmpty]}>
            {row.value === null ? EMPTY_VALUE : formatCount(row.value)}
          </Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.borderRadius.xl,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.mdLg,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.sectionLabel,
    fontWeight: tokens.typography.fontWeight.semibold,
    letterSpacing: tokens.typography.letterSpacing.sectionLabel,
    textTransform: 'uppercase',
    color: tokens.colors.textHint,
  },
  unit: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textHint,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: tokens.spacing.smMd,
  },
  rowDivider: {
    borderTopWidth: tokens.borderWidth.hairline,
    borderTopColor: tokens.colors.border,
  },
  label: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.input,
    color: tokens.colors.textMuted,
  },
  value: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.input,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
  },
  valueEmpty: {
    color: tokens.colors.textHint,
  },
});
