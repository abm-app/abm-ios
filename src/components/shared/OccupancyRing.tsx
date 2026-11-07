import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import tokens from '@/theme/tokens';

interface OccupancyRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  // Digits after the decimal point in the centre label.
  decimals?: number;
}

function getProgressColor(percentage: number): string {
  if (percentage >= 80) return tokens.colors.occupancyHigh;
  if (percentage <= 50) return tokens.colors.occupancyLow;
  return tokens.colors.occupancyMid;
}

export default function OccupancyRing({
  percentage,
  size = tokens.occupancyRing.dashboard.size,
  strokeWidth = tokens.occupancyRing.dashboard.strokeWidth,
  decimals = 0,
}: OccupancyRingProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;
  const containerStyle = useMemo(() => [styles.container, { width: size, height: size }], [size]);

  return (
    <View style={containerStyle}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          stroke={tokens.colors.chipNeutralBg}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={getProgressColor(clamped)}
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
      <View style={styles.textContainer}>
        <Text style={styles.percentage}>{clamped.toFixed(decimals)}%</Text>
        <Text style={styles.label}>Occupancy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.h1,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  label: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
    marginTop: tokens.spacing.xxs,
  },
});
