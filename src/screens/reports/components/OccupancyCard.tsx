import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import { OccupancyRing } from '@/components/shared';
import { formatCount } from '@/utils/formatters';

interface OccupancyCardProps {
  percentage: number;
  occupied: number;
  vacant: number;
  // Number of days for a weekly or monthly report; null for a single day.
  days: number | null;
}

export default function OccupancyCard({ percentage, occupied, vacant, days }: OccupancyCardProps) {
  const unit =
    days === null ? `rooms of ${formatCount(occupied + vacant)}` : `room-nights · ${days} days`;

  return (
    <Card variant="shadow-outlined" shadow="elevatedCard" padded style={styles.card}>
      <View style={styles.row}>
        <OccupancyRing
          percentage={percentage}
          size={tokens.occupancyRing.report.size}
          strokeWidth={tokens.occupancyRing.report.strokeWidth}
          decimals={1}
        />
        <View style={styles.chips}>
          <View style={styles.chip}>
            <View style={[styles.dot, styles.dotOccupied]} />
            <Text style={styles.chipText}>Occupied: {formatCount(occupied)}</Text>
          </View>
          <View style={styles.chip}>
            <View style={[styles.dot, styles.dotVacant]} />
            <Text style={styles.chipText}>Vacant: {formatCount(vacant)}</Text>
          </View>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.borderRadius.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.mdLg,
  },
  chips: {
    flex: 1,
    alignItems: 'flex-end',
    gap: tokens.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.smMd,
    backgroundColor: tokens.colors.chipNeutralBg,
    borderRadius: tokens.borderRadius.pill,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.mdLg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotOccupied: {
    backgroundColor: tokens.colors.primary,
  },
  dotVacant: {
    backgroundColor: tokens.colors.success,
  },
  chipText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.chip,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
  },
  unit: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
  },
});
