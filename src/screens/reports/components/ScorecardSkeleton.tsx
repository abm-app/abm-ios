import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';

const PULSE_MS = 800;
const PULSE_MIN_OPACITY = 0.45;

// Placeholder for the ring, four KPI tiles and two cards while a report loads.
export default function ScorecardSkeleton() {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: PULSE_MIN_OPACITY,
          duration: PULSE_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: PULSE_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const stackStyle = useMemo(() => [styles.stack, { opacity }], [opacity]);

  return (
    <Animated.View style={stackStyle} accessibilityLabel="Loading report">
      <View style={styles.ringCard}>
        <View style={styles.ring} />
        <View style={styles.ringChips}>
          <View style={styles.chip} />
          <View style={styles.chip} />
        </View>
      </View>
      <View style={styles.kpiGrid}>
        <View style={styles.kpi} />
        <View style={styles.kpi} />
        <View style={styles.kpi} />
        <View style={styles.kpi} />
      </View>
      <View style={styles.card} />
      <View style={styles.card} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: tokens.spacing.lgMd,
  },
  ringCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.borderRadius.xl,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
    padding: tokens.spacing.xlMd,
  },
  ring: {
    width: tokens.occupancyRing.report.size,
    height: tokens.occupancyRing.report.size,
    borderRadius: tokens.occupancyRing.report.size / 2,
    backgroundColor: tokens.colors.surface,
  },
  ringChips: {
    alignItems: 'flex-end',
    gap: tokens.spacing.sm,
  },
  chip: {
    width: 120,
    height: 32,
    borderRadius: tokens.borderRadius.pill,
    backgroundColor: tokens.colors.surface,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.mdLg,
  },
  kpi: {
    flexBasis: '47%',
    flexGrow: 1,
    height: 76,
    borderRadius: tokens.borderRadius.lg,
    backgroundColor: tokens.colors.surface,
  },
  card: {
    height: 150,
    borderRadius: tokens.borderRadius.xl,
    backgroundColor: tokens.colors.surface,
  },
});
