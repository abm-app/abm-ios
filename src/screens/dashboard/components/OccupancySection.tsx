import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import tokens from '../../../theme/tokens';
import { Card } from '../../../components/ui';
import type { AuditProperty } from '../../../types/audit';
import type { DashboardOccupancy, DashboardSummary } from '../../../types/dashboard';
import { formatRupees } from '../../../utils/formatters';

interface OccupancySectionProps {
  occupancy: DashboardOccupancy;
  todayRevenue: Record<AuditProperty, number>;
  // Only the owner gets a net (the balance). Absent for staff and managers.
  todayFinance?: DashboardSummary['todayFinance'];
  // Tapping the balance opens the Expenses screen.
  onBalancePress?: () => void;
}

const PROPERTY_DISPLAY_NAMES: Record<string, string> = {
  express: 'ABM Express',
  international: 'ABM International',
};

function getPropertyDisplayName(key: string): string {
  return PROPERTY_DISPLAY_NAMES[key] ?? key;
}

// ─── Colour helper ──────────────────────────────────────────────────────────

function getProgressColor(percentage: number): string {
  if (percentage >= 80) return tokens.colors.occupancyHigh;
  if (percentage <= 50) return tokens.colors.occupancyLow;
  return tokens.colors.occupancyMid;
}

// ─── Local Circular Progress Component ────────────────────────────────────────

function CircularProgress({ percentage }: { percentage: number }) {
  const strokeColor = getProgressColor(percentage);
  const size = 90;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.progressContainer}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Circle */}
        <Circle
          stroke={tokens.colors.chipNeutralBg}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <Circle
          stroke={strokeColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.progressTextContainer}>
        <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
        <Text style={styles.progressLabel}>Occupancy</Text>
      </View>
    </View>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function OccupancySection({
  occupancy,
  todayRevenue,
  todayFinance,
  onBalancePress,
}: OccupancySectionProps) {
  return (
    <View>
      <View style={styles.cardsContainer}>
        {Object.entries(occupancy).map(([propertyKey, data]) => {
          const { occupied, total } = data;
          const vacant = total - occupied;
          const percentage = total > 0 ? (occupied / total) * 100 : 0;
          const displayName = getPropertyDisplayName(propertyKey);
          const revenue = todayRevenue[propertyKey as AuditProperty] ?? 0;
          const balance = todayFinance?.[propertyKey as AuditProperty]?.net;

          const formattedRevenue = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
          }).format(revenue);

          return (
            <Card
              key={propertyKey}
              padded
              variant="shadow-outlined"
              shadow="elevatedCard"
              style={styles.card}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconBoxNeutral}>
                  <FontAwesome name="building-o" size={20} color={tokens.colors.primary} />
                </View>
                <Text style={styles.propertyName}>{displayName}</Text>
              </View>

              {/* Middle Row */}
              <View style={styles.middleRow}>
                <CircularProgress percentage={percentage} />
                <View style={styles.chipsContainer}>
                  <View style={[styles.chip, { backgroundColor: tokens.colors.chipNeutralBg }]}>
                    <View style={styles.dotPurple} />
                    <Text style={styles.chipText}>Occupied: {occupied}</Text>
                  </View>
                  <View style={[styles.chip, { backgroundColor: tokens.colors.chipNeutralBg }]}>
                    <View style={styles.dotSuccess} />
                    <Text style={styles.chipText}>Vacant: {vacant}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Bottom Row */}
              <View style={styles.bottomRow}>
                <View style={styles.iconBoxSuccess}>
                  <Feather name="trending-up" size={20} color={tokens.colors.success} />
                </View>
                <View style={styles.revenueInfo}>
                  <Text style={styles.revenueLabel}>{"Today's Revenue"}</Text>
                  <Text style={styles.revenueAmount}>{formattedRevenue}</Text>
                </View>

                {balance !== undefined && (
                  <TouchableOpacity
                    style={styles.balanceButton}
                    onPress={onBalancePress}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Balance ${formatRupees(Math.round(balance))}. Open expenses`}
                  >
                    <View style={styles.balanceLabelRow}>
                      <Text style={styles.balanceLabel}>Balance</Text>
                      <Feather
                        name="chevron-right"
                        size={tokens.iconSizes.inline}
                        color={tokens.colors.textHint}
                      />
                    </View>
                    <Text style={[styles.balanceAmount, balance < 0 && styles.balanceNegative]}>
                      {formatRupees(Math.round(balance))}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          );
        })}
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  cardsContainer: {
    paddingBottom: tokens.spacing.xlMd,
    gap: tokens.spacing.lgMd,
  },
  card: {
    borderRadius: tokens.borderRadius.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.mdLg,
    marginBottom: tokens.spacing.lgMd,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: tokens.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxNeutral: {
    width: 44,
    height: 44,
    borderRadius: tokens.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.chipNeutralBg,
  },
  iconBoxSuccess: {
    width: 44,
    height: 44,
    borderRadius: tokens.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.successLight,
  },
  propertyName: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.lgMd,
  },
  progressContainer: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  progressTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.h1,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  progressLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
    marginTop: 2,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    paddingBottom: tokens.spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: tokens.borderRadius.pill,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    gap: tokens.spacing.smMd,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotPurple: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.colors.textPrimary,
  },
  dotSuccess: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.colors.success,
  },
  chipText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: '500',
    color: tokens.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginBottom: tokens.spacing.lgMd,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.mdLg,
  },
  balanceButton: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.borderRadius.lg,
    backgroundColor: tokens.colors.chipNeutralBg,
  },
  balanceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xxs,
  },
  balanceLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
  },
  balanceAmount: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  balanceNegative: {
    color: tokens.colors.danger,
  },
  revenueInfo: {
    flexDirection: 'column',
    gap: 2,
  },
  revenueLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
  },
  revenueAmount: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.h1,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
    letterSpacing: -0.5,
  },
});
