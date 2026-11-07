import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import { EMPTY_VALUE, formatCount, formatRupeesWhole } from '@/utils/formatters';

export interface DetailRow {
  label: string;
  // Null means the backend has not synced it yet: shown as a dash, never as zero.
  value: number | null;
  // How the value is written. Defaults to a plain count.
  kind?: 'count' | 'rupees';
  // The closing "Net" line: larger, and green when it is not negative.
  isNet?: boolean;
}

interface DetailRowsCardProps {
  title: string;
  // Unit of the figures ("guests", "room-nights"), shown beside the title.
  unit?: string;
  rows: DetailRow[];
}

function formatValue(row: DetailRow): string {
  if (row.value === null) return EMPTY_VALUE;
  return row.kind === 'rupees' ? formatRupeesWhole(row.value) : formatCount(row.value);
}

export default function DetailRowsCard({ title, unit, rows }: DetailRowsCardProps) {
  return (
    <Card variant="shadow-outlined" shadow="elevatedCard" padded style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      {rows.map((row, index) => {
        const isEmpty = row.value === null;
        const isPositiveNet = row.isNet === true && row.value !== null && row.value >= 0;
        return (
          <View
            key={row.label}
            style={[styles.row, index > 0 && styles.rowDivider, row.isNet && styles.netRow]}
          >
            <Text style={styles.label}>{row.label}</Text>
            <Text
              style={[
                styles.value,
                row.isNet && styles.netValue,
                isPositiveNet && styles.positive,
                isEmpty && styles.valueEmpty,
              ]}
            >
              {formatValue(row)}
            </Text>
          </View>
        );
      })}
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
  netRow: {
    paddingTop: tokens.spacing.mdLg,
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
  netValue: {
    fontSize: tokens.typography.fontSize.body,
  },
  positive: {
    color: tokens.colors.success,
  },
  valueEmpty: {
    color: tokens.colors.textHint,
  },
});
