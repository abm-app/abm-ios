import React from 'react';
import { View, Text, StyleSheet, DimensionValue } from 'react-native';
import Card from '@/components/ui/Card';
import tokens from '@/theme/tokens';
import { formatCurrency } from '@/utils/formatters';

// ─── Props ──────────────────────────────────────────────────────────────────

interface PropertyBreakdownProps {
  internationalTotal: number;
  expressTotal: number;
  propertyMax: number;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function PropertyBreakdown({
  internationalTotal,
  expressTotal,
  propertyMax,
}: PropertyBreakdownProps) {
  const intlWidthPct = `${(internationalTotal / propertyMax) * 100}%` as DimensionValue;
  const exprWidthPct = `${(expressTotal / propertyMax) * 100}%` as DimensionValue;

  return (
    <Card variant="outlined" padded style={styles.card}>
      <Text style={styles.cardLabel}>Property Breakdown</Text>

      <View style={styles.propertyRow}>
        <Text style={styles.propertyName}>International</Text>
        <Text style={styles.propertyValue}>{formatCurrency(internationalTotal)}</Text>
      </View>
      <View style={styles.barTrackHoriz}>
        <View style={[styles.barFillHoriz, { width: intlWidthPct }]} />
      </View>

      <View style={[styles.propertyRow, styles.propertyRowGap]}>
        <Text style={styles.propertyName}>Express</Text>
        <Text style={styles.propertyValue}>{formatCurrency(expressTotal)}</Text>
      </View>
      <View style={styles.barTrackHoriz}>
        <View style={[styles.barFillHoriz, styles.barFillHorizAlt, { width: exprWidthPct }]} />
      </View>
    </Card>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  cardLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: tokens.typography.letterSpacing.captionCaps,
    marginBottom: tokens.spacing.sm,
  },
  propertyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  propertyRowGap: {
    marginTop: tokens.spacing.md,
  },
  propertyName: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
    fontWeight: tokens.typography.fontWeight.medium,
  },
  propertyValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
    fontWeight: tokens.typography.fontWeight.semibold,
  },
  barTrackHoriz: {
    height: 8,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.xs,
    overflow: 'hidden',
  },
  barFillHoriz: {
    height: '100%',
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.borderRadius.xs,
  },
  barFillHorizAlt: {
    backgroundColor: tokens.colors.textSecondary,
  },
});
