import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';

// ─── Spacing bar data ────────────────────────────────────────────────────────

const spacingBars = [
  { label: 'xs — 4px', width: tokens.spacing.xs },
  { label: 'sm — 8px', width: tokens.spacing.sm },
  { label: 'md — 12px', width: tokens.spacing.mdLg },
  { label: 'lg — 16px', width: tokens.spacing.lgMd },
  { label: 'xl — 24px', width: tokens.spacing.xxl },
  { label: '2xl — 32px', width: tokens.spacing.xxlMd },
  { label: '3xl — 48px', width: tokens.spacing.xxxl },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function SpacingScale() {
  return (
    <View style={styles.container}>
      {spacingBars.map(bar => (
        <View key={bar.label} style={styles.row}>
          <Text style={styles.label}>{bar.label}</Text>
          <View style={[styles.bar, { width: bar.width }]} />
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
});
