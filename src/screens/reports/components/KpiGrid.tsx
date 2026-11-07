import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import { EMPTY_VALUE, formatRupeesWhole } from '@/utils/formatters';

export interface Kpi {
  label: string;
  // Null (for example F&B revenue before it is synced) renders a dash.
  value: number | null;
}

interface KpiGridProps {
  items: Kpi[];
}

export default function KpiGrid({ items }: KpiGridProps) {
  return (
    <View style={styles.grid}>
      {items.map(item => (
        <Card key={item.label} variant="shadow-outlined" shadow="elevatedCard" style={styles.tile}>
          <Text style={styles.label}>{item.label}</Text>
          <Text
            style={[styles.value, item.value === null && styles.valueEmpty]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {item.value === null ? EMPTY_VALUE : formatRupeesWhole(item.value)}
          </Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.mdLg,
  },
  tile: {
    // Two per row: half the width minus half the gap.
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: tokens.borderRadius.lg,
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.lgMd,
  },
  label: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
  },
  value: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.textPrimary,
    marginTop: tokens.spacing.xs,
  },
  valueEmpty: {
    color: tokens.colors.textHint,
  },
});
