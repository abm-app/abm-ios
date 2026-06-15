import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';
import SectionLabel from './SectionLabel';

// ─── Data ────────────────────────────────────────────────────────────────────

const scale = [
  { name: 'xs', value: tokens.spacing.xs },
  { name: 'sm', value: tokens.spacing.sm },
  { name: 'md', value: tokens.spacing.mdLg },
  { name: 'lg', value: tokens.spacing.lgMd },
  { name: 'xl', value: tokens.spacing.xxl },
  { name: '2xl', value: tokens.spacing.xxlMd },
  { name: '3xl', value: tokens.spacing.xxxl },
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
            <View style={[styles.bar, { width: s.value }]} />
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
});
