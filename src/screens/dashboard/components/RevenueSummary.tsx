import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '../../../theme/tokens';
import { Card } from '../../../components/ui';

interface RevenueSummaryProps {
  todayRevenue: number;
}

export default function RevenueSummary({ todayRevenue }: RevenueSummaryProps) {
  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(todayRevenue);

  return (
    <Card variant="shadow-outlined" shadow="elevatedCard" style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          <Feather name="credit-card" size={tokens.iconSizes.md} color={tokens.colors.white} />
        </View>
        <Text style={styles.label}>{'Today’s Revenue'}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.amount}>{formattedRevenue}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.dashboardCardDarkBg,
    padding: tokens.spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: tokens.spacing.s,
  },
  iconContainer: {
    backgroundColor: tokens.colors.dashboardCardDarkSurfaceBg,
    width: tokens.iconSizes.container,
    height: tokens.iconSizes.container,
    borderRadius: tokens.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    justifyContent: 'center',
  },
  amount: {
    fontFamily: tokens.typography.fontFamily.headingBold,
    fontSize: tokens.typography.fontSize.numeric,
    fontWeight: '700',
    color: tokens.colors.white,
  },
  label: {
    fontFamily: tokens.typography.fontFamily.headingBold,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: '600',
    color: tokens.colors.white,
    opacity: 0.6,
  },
});
