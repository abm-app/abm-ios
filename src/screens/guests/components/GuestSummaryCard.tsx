import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';

interface GuestSummaryCardProps {
  spendableBalance: number;
  tier: string;
  totalStays: number;
}

export default function GuestSummaryCard({
  spendableBalance,
  tier,
  totalStays,
}: GuestSummaryCardProps) {
  return (
    <Card variant="dark" style={styles.summaryCard}>
      <View style={styles.summaryHalf}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryLabel}>Available{'\n'}Points</Text>
          <View style={styles.tierBadge}>
            <Text style={styles.tierBadgeText}>{tier.toUpperCase()} TIER</Text>
          </View>
        </View>
        <Text style={styles.summaryValue}>{spendableBalance.toLocaleString()}</Text>
      </View>

      <View style={styles.summaryDivider} />

      <View style={[styles.summaryHalf, styles.summaryHalfRight]}>
        <Text style={[styles.summaryLabel, styles.summaryLabelRight]}>Total Nights</Text>
        <Text style={styles.summaryValue}>{totalStays}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    flexDirection: 'row',
    marginHorizontal: tokens.spacing.xlMd,
    padding: tokens.spacing.xl,
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.xxl,
  },
  summaryHalf: {
    flex: 1,
    justifyContent: 'center',
  },
  summaryHalfRight: {
    alignItems: 'flex-end',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  summaryLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
    letterSpacing: 0.5,
    marginRight: tokens.spacing.md,
    flex: 1,
  },
  summaryLabelRight: {
    textAlign: 'right',
  },
  tierBadge: {
    backgroundColor: tokens.colors.badgeSuiteBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierBadgeText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 9,
    color: tokens.colors.badgeSuiteText,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 32,
    color: tokens.colors.white,
    fontWeight: '400',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: tokens.colors.textSecondary,
    marginHorizontal: tokens.spacing.lg,
  },
});
