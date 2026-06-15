import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';
import SectionLabel from './SectionLabel';

// ─── Data ────────────────────────────────────────────────────────────────────

const scale = [
  { name: 'xs', value: tokens.spacing.xs, styleKey: 'barXs' as const },
  { name: 'sm', value: tokens.spacing.sm, styleKey: 'barSm' as const },
  { name: 'md', value: tokens.spacing.md, styleKey: 'barMd' as const },
  { name: 'lg', value: tokens.spacing.lg, styleKey: 'barLg' as const },
  { name: 'xl', value: tokens.spacing.xl, styleKey: 'barXl' as const },
  { name: '2xl', value: tokens.spacing.xlMd, styleKey: 'bar2xl' as const },
  { name: '3xl', value: tokens.spacing.xxxl, styleKey: 'bar3xl' as const },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function SpacingScaleSection() {
  return (
    <View style={styles.section}>
      <SectionLabel title="Spacing Scale" />
      <View style={styles.list}>
        {scale.map(s => (
          <View key={s.name} style={styles.row}>
            <Text style={styles.label}>
              {s.name} — {s.value}px
            </Text>
            <View style={[styles.bar, styles[s.styleKey]]} />
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  section: {
    marginBottom: tokens.dsSection.marginBottom,
  },
  list: {},
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
    width: tokens.spacing.md,
  },
  barLg: {
    width: tokens.spacing.lg,
  },
  barXl: {
    width: tokens.spacing.xl,
  },
  bar2xl: {
    width: tokens.spacing.xlMd,
  },
  bar3xl: {
    width: tokens.spacing.xxxl,
  },
});
