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
      <View style={styles.iconContainer}>
        <Feather name="credit-card" size={24} color={tokens.colors.white} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.amount}>{formattedRevenue}</Text>
        <Text style={styles.label}>{"TODAY'S REVENUE"}</Text>
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
  },
  iconContainer: {
    backgroundColor: tokens.colors.dashboardCardDarkSurfaceBg,
    width: 48,
    height: 48,
    borderRadius: tokens.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.lgMd,
  },
  textContainer: {
    flex: 1,
  },
  amount: {
    fontSize: tokens.typography.fontSize.numeric,
    fontWeight: '700',
    color: tokens.colors.white,
    marginBottom: 4,
  },
  label: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: '600',
    color: tokens.colors.white,
    opacity: 0.6,
    letterSpacing: 1.5,
  },
});
