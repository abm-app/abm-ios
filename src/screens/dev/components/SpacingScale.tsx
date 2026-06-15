import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';

// ─── Spacing bar data ────────────────────────────────────────────────────────

const spacingBars = [
  { label: 'xs — 4px', styleKey: 'barXs' as const },
  { label: 'sm — 8px', styleKey: 'barSm' as const },
  { label: 'md — 12px', styleKey: 'barMd' as const },
  { label: 'lg — 16px', styleKey: 'barLg' as const },
  { label: 'xl — 24px', styleKey: 'barXl' as const },
  { label: '2xl — 32px', styleKey: 'bar2xl' as const },
  { label: '3xl — 48px', styleKey: 'bar3xl' as const },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function SpacingScale() {
  return (
    <View style={styles.container}>
      {spacingBars.map(bar => (
        <View key={bar.label} style={styles.row}>
          <Text style={styles.label}>{bar.label}</Text>
          <View style={[styles.bar, styles[bar.styleKey]]} />
        </View>
      ))}
    </View>
  );
}

// ─── Static styles ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacingRow.gap,
    marginBottom: tokens.spacingRow.marginBottom,
  },
  label: {
    width: tokens.spacingRow.labelWidth,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textMuted,
  },
  bar: {
    height: tokens.spacingRow.barHeight,
    borderRadius: tokens.spacingRow.barBorderRadius,
    backgroundColor: tokens.colors.primary,
  },
  barXs: {
    width: tokens.spacing.xs,
  },
  barSm: {
    width: tokens.spacing.sm,
  },
  barMd: {
    width: tokens.spacing.mdLg,
  },
  barLg: {
    width: tokens.spacing.lgMd,
  },
  barXl: {
    width: tokens.spacing.xxl,
  },
  bar2xl: {
    width: tokens.spacing.xxlMd,
  },
  bar3xl: {
    width: tokens.spacing.xxxl,
  },
});
