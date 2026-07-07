import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '../../theme/tokens';

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
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          <Feather name="credit-card" size={24} color={tokens.colors.white} />
        </View>
        <Text style={styles.label}>{"TODAY'S REVENUE"}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.amount}>{formattedRevenue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.dashboardCardDarkBg,
    borderRadius: tokens.borderRadius.xlMd,
    padding: tokens.spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
  },
  iconContainer: {
    backgroundColor: tokens.colors.dashboardCardDarkSurfaceBg,
    width: 48,
    height: 48,
    borderRadius: tokens.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    justifyContent: 'center',
  },
  amount: {
    fontSize: tokens.typography.fontSize.numeric,
    fontWeight: '700',
    color: tokens.colors.white,
  },
  label: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: '600',
    color: tokens.colors.white,
    opacity: 0.6,
    letterSpacing: 1.5,
  },
});
