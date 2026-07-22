import React from 'react';
import { View, Text, StyleSheet, DimensionValue } from 'react-native';
import Card from '@/components/ui/Card';
import tokens from '@/theme/tokens';
import { formatCurrency } from '@/utils/formatters';
import { formatMonth } from '@/utils/dateUtils';
import type { RevenueTrendMonth } from '@/types/revenue';

// ─── Props ──────────────────────────────────────────────────────────────────

interface TrendChartProps {
  data: RevenueTrendMonth[];
  maxTrend: number;
}

// ─── Helper ─────────────────────────────────────────────────────────────────

function getBarHeightStyle(percent: number): { height: DimensionValue } {
  return { height: `${Math.max(percent, 4)}%` as DimensionValue };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function TrendChart({ data, maxTrend }: TrendChartProps) {
  if (data.length === 0) return null;

  return (
    <Card variant="outlined" padded style={styles.card}>
      <Text style={styles.cardLabel}>Monthly Trend</Text>
      <View style={styles.chartContainer}>
        {data.map(item => {
          const combined = (item.international ?? 0) + (item.express ?? 0);
          const heightPct = maxTrend > 0 ? combined / maxTrend : 0;
          const safeHeightPct = Number.isNaN(heightPct) ? 0 : heightPct;
          return (
            <View key={item.month} style={styles.barWrapper}>
              <Text style={styles.barValue}>{formatCurrency(combined)}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, getBarHeightStyle(safeHeightPct * 100)]} />
              </View>
              <Text style={styles.barLabel}>{formatMonth(item.month)}</Text>
            </View>
          );
        })}
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
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.sm,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.chartSmall,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.xxs,
  },
  barTrack: {
    flex: 1,
    width: '100%',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.xs,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.borderRadius.xs,
  },
  barLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.miniStatLabel,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xs,
  },
});
