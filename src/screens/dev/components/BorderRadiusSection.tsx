import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';
import SectionLabel from './SectionLabel';

// ─── Data ────────────────────────────────────────────────────────────────────

const radii = [
  { name: 'sm', value: tokens.borderRadius.sm, styleKey: 'boxSm' as const },
  { name: 'md', value: tokens.borderRadius.md, styleKey: 'boxMd' as const },
  { name: 'lg', value: tokens.borderRadius.lg, styleKey: 'boxLg' as const },
  { name: 'xl', value: tokens.borderRadius.xl, styleKey: 'boxXl' as const },
  { name: 'pill', value: tokens.borderRadius.pill, styleKey: 'boxPill' as const },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function BorderRadiusSection() {
  return (
    <View style={styles.section}>
      <SectionLabel title="Border Radius" />
      <View style={styles.grid}>
        {radii.map(r => (
          <View key={r.name} style={styles.item}>
            <View style={[styles.box, styles[r.styleKey]]} />
            <Text style={styles.label}>
              {r.name}
              {'\n'}
              {r.value}px
            </Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.radiusExample.gap,
  },
  item: {
    alignItems: 'center',
    gap: tokens.spacing.s,
  },
  box: {
    width: tokens.radiusExample.boxWidth,
    height: tokens.radiusExample.boxHeight,
    backgroundColor: tokens.colors.secondary,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.borderMd,
  },
  boxSm: {
    borderRadius: tokens.borderRadius.sm,
  },
  boxMd: {
    borderRadius: tokens.borderRadius.md,
  },
  boxLg: {
    borderRadius: tokens.borderRadius.lg,
  },
  boxXl: {
    borderRadius: tokens.borderRadius.xl,
  },
  boxPill: {
    borderRadius: tokens.borderRadius.pill,
  },
  label: {
    fontSize: tokens.typography.fontSize.swatchValue,
    color: tokens.colors.textHint,
    textAlign: 'center',
  },
});
