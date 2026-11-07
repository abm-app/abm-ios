import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import { formatCount, formatPercent } from '@/utils/formatters';

interface GuestMixCardProps {
  domestic: number;
  foreigner: number;
  domesticPct: number;
  foreignerPct: number;
}

export default function GuestMixCard({
  domestic,
  foreigner,
  domesticPct,
  foreignerPct,
}: GuestMixCardProps) {
  // Segment widths are shares of the bar, so flex ratios keep them exact.
  const domesticSegment = useMemo(
    () => [styles.segmentDomestic, { flex: domesticPct }],
    [domesticPct],
  );
  const foreignerSegment = useMemo(
    () => [styles.segmentForeigner, { flex: foreignerPct }],
    [foreignerPct],
  );

  return (
    <Card variant="shadow-outlined" shadow="elevatedCard" padded style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Guest mix</Text>
        <Text style={styles.unit}>arrivals</Text>
      </View>
      <View style={styles.bar}>
        <View style={domesticSegment} />
        <View style={foreignerSegment} />
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.segmentDomestic]} />
          <Text style={styles.legendLabel}>Domestic</Text>
          <Text style={styles.legendValue}>
            {formatCount(domestic)} · {formatPercent(domesticPct)}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.segmentForeigner]} />
          <Text style={styles.legendLabel}>Foreigner</Text>
          <Text style={styles.legendValue}>
            {formatCount(foreigner)} · {formatPercent(foreignerPct)}
          </Text>
        </View>
      </View>
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
  bar: {
    flexDirection: 'row',
    height: 10,
    gap: tokens.spacing.xxs,
    borderRadius: tokens.borderRadius.pill,
    overflow: 'hidden',
    backgroundColor: tokens.colors.chipNeutralBg,
  },
  segmentDomestic: {
    backgroundColor: tokens.colors.primary,
  },
  segmentForeigner: {
    backgroundColor: tokens.colors.reportMixForeigner,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: tokens.spacing.mdLg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
  legendValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
  },
});
