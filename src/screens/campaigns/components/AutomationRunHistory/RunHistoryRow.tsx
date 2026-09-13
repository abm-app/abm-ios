import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import type { AutomationRun } from '@/types/campaign';
import { formatDateTime } from '@/utils/dateUtils';

interface Props {
  run: AutomationRun;
}

export default function RunHistoryRow({ run }: Props) {
  const hasError = !!run.error;
  const isZeroMatch = !hasError && run.matched === 0;

  return (
    <Card
      padded
      variant="shadow-outlined"
      shadow="elevatedCard"
      style={[styles.card, isZeroMatch && styles.cardMuted]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.timestamp, isZeroMatch && styles.timestampMuted]}>
          {formatDateTime(run.startedAt) || run.startedAt}
        </Text>
        {hasError && (
          <View style={styles.errorPill}>
            <Feather
              name="alert-triangle"
              size={tokens.iconSizes.inline}
              color={tokens.colors.danger}
            />
            <Text style={styles.errorPillText}>Error</Text>
          </View>
        )}
      </View>

      {hasError ? (
        <Text style={styles.errorText}>{run.error}</Text>
      ) : (
        <View style={styles.countsRow}>
          <View style={styles.countItem}>
            <Text style={[styles.countValue, isZeroMatch && styles.countValueMuted]}>
              {run.matched}
            </Text>
            <Text style={styles.countLabel}>Matched</Text>
          </View>
          <View style={styles.countItem}>
            <Text style={[styles.countValue, isZeroMatch && styles.countValueMuted]}>
              {run.enqueued}
            </Text>
            <Text style={styles.countLabel}>Enqueued</Text>
          </View>
          <View style={styles.countItem}>
            <Text style={[styles.countValue, isZeroMatch && styles.countValueMuted]}>
              {run.skipped}
            </Text>
            <Text style={styles.countLabel}>Skipped</Text>
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: tokens.spacing.md,
  },
  cardMuted: {
    opacity: 0.6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.sm,
  },
  timestamp: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  timestampMuted: {
    fontWeight: '500',
    color: tokens.colors.textMuted,
  },
  errorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    backgroundColor: tokens.colors.dangerLight,
    paddingVertical: tokens.chip.paddingVertical,
    paddingHorizontal: tokens.chip.paddingHorizontal,
    borderRadius: tokens.borderRadius.pill,
  },
  errorPillText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.chip.fontSize,
    fontWeight: tokens.chip.fontWeight,
    color: tokens.colors.danger,
  },
  errorText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.danger,
  },
  countsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countItem: {
    alignItems: 'center',
    flex: 1,
  },
  countValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  countValueMuted: {
    color: tokens.colors.textMuted,
  },
  countLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xs,
  },
});
