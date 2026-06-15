import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';
import SectionLabel from './SectionLabel';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Derive a human-readable display label from a token color value. */
function formatColorForDisplay(color: string): string {
  if (color.startsWith('#')) return color.toUpperCase();
  if (color.startsWith('rgba')) {
    const match = color.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/);
    if (match) {
      const pct = Math.round(parseFloat(match[1]) * 100);
      return `${pct}% #000`;
    }
  }
  return color;
}

// ─── Data ────────────────────────────────────────────────────────────────────

/* eslint-disable no-restricted-syntax -- display strings for the design-system preview */
const swatches = [
  { name: 'Primary', value: tokens.colors.primary, styleKey: 'blockPrimary' as const },
  { name: 'Secondary', value: tokens.colors.secondary, styleKey: 'blockSecondary' as const },
  { name: 'Surface', value: tokens.colors.surface, styleKey: 'blockSurface' as const },
  {
    name: 'Background',
    value: tokens.colors.background,
    hasBorder: true,
    styleKey: 'blockBackground' as const,
  },
  { name: 'Danger', value: tokens.colors.danger, styleKey: 'blockDanger' as const },
  { name: 'Success', value: tokens.colors.success, styleKey: 'blockSuccess' as const },
  { name: 'Warning', value: tokens.colors.warning, styleKey: 'blockWarning' as const },
  { name: 'Info', value: tokens.colors.info, styleKey: 'blockInfo' as const },
] as const;
/* eslint-enable no-restricted-syntax */

// ─── Component ───────────────────────────────────────────────────────────────

export default function ColorTokensSection() {
  return (
    <View style={styles.section}>
      <SectionLabel title="Colour Tokens" />
      <View style={styles.grid}>
        {swatches.map(s => (
          <View key={s.name} style={styles.swatchCard}>
            <View
              style={[
                styles.swatchBlock,
                styles[s.styleKey],
                'hasBorder' in s && s.hasBorder ? styles.swatchBlockBorder : null,
              ]}
            />
            <View style={styles.swatchMeta}>
              <Text style={styles.swatchName}>{s.name}</Text>
              <Text style={styles.swatchHex}>{formatColorForDisplay(s.value)}</Text>
            </View>
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
    gap: tokens.swatch.gridGap,
  },
  swatchCard: {
    flexBasis: '46%',
    flexGrow: 1,
    borderRadius: tokens.swatch.borderRadius,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
    overflow: 'hidden',
  },
  swatchBlock: {
    height: tokens.swatch.blockHeight,
  },
  blockPrimary: {
    backgroundColor: tokens.colors.primary,
  },
  blockSecondary: {
    backgroundColor: tokens.colors.secondary,
  },
  blockSurface: {
    backgroundColor: tokens.colors.surface,
  },
  blockBackground: {
    backgroundColor: tokens.colors.background,
  },
  blockDanger: {
    backgroundColor: tokens.colors.danger,
  },
  blockSuccess: {
    backgroundColor: tokens.colors.success,
  },
  blockWarning: {
    backgroundColor: tokens.colors.warning,
  },
  blockInfo: {
    backgroundColor: tokens.colors.info,
  },
  swatchBlockBorder: {
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
  },
  swatchMeta: {
    paddingVertical: tokens.swatch.metaPaddingVertical,
    paddingHorizontal: tokens.swatch.metaPaddingHorizontal,
    backgroundColor: tokens.colors.background,
  },
  swatchName: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
  },
  swatchHex: {
    fontSize: tokens.typography.fontSize.swatchValue,
    color: tokens.colors.textHint,
  },
});
