import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import tokens from '../../../theme/tokens';

interface OccupancySectionProps {
  occupancy: Record<string, { name?: string; occupied: number; total: number }>;
  todayRevenue: Record<string, number>;
}

// ─── Local Circular Progress Component ────────────────────────────────────────

function CircularProgress({ percentage }: { percentage: number }) {
  const size = 110;
  const strokeWidth = 10;
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
          stroke={tokens.colors.primary}
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

export default function OccupancySection({ occupancy, todayRevenue }: OccupancySectionProps) {
  return (
    <View>
      <View style={styles.cardsContainer}>
        {Object.entries(occupancy).map(([propertyKey, data]) => {
          const { name, occupied, total } = data;
          const vacant = total - occupied;
          const percentage = total > 0 ? (occupied / total) * 100 : 0;
          const displayName = name || propertyKey;
          const revenue = todayRevenue[propertyKey] || 0;

          const formattedRevenue = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
          }).format(revenue);

          return (
            <View key={propertyKey} style={styles.card}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconBoxNeutral}>
                  <Ionicons name="business" size={22} color={tokens.colors.primary} />
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
              </View>
            </View>
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
    backgroundColor: tokens.colors.white,
    borderRadius: tokens.borderRadius.xl,
    padding: tokens.spacing.xlMd,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: tokens.colors.borderDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.mdLg,
    marginBottom: tokens.spacing.xl,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.xl,
  },
  progressContainer: {
    width: 110,
    height: 110,
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
