import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';

// ─── Swatch data ─────────────────────────────────────────────────────────────

/* eslint-disable no-restricted-syntax -- display strings for the design-system preview */
const swatches = [
  { name: 'Primary', value: '#000000', showBorder: false, styleKey: 'blockPrimary' as const },
  { name: 'Secondary', value: '15% #000', showBorder: false, styleKey: 'blockSecondary' as const },
  { name: 'Surface', value: '6% #000', showBorder: false, styleKey: 'blockSurface' as const },
  {
    name: 'Background',
    value: '#FFFFFF',
    showBorder: true,
    styleKey: 'blockBackground' as const,
  },
  { name: 'Danger', value: '#C0392B', showBorder: false, styleKey: 'blockDanger' as const },
  { name: 'Success', value: '#27AE60', showBorder: false, styleKey: 'blockSuccess' as const },
  { name: 'Warning', value: '#F59E0B', showBorder: false, styleKey: 'blockWarning' as const },
  { name: 'Info', value: '#2471A3', showBorder: false, styleKey: 'blockInfo' as const },
] as const;
/* eslint-enable no-restricted-syntax */

// ─── Component ───────────────────────────────────────────────────────────────

export default function ColorSwatches() {
  return (
    <View style={styles.grid}>
      {swatches.map(swatch => (
        <View key={swatch.name} style={styles.card}>
          <View
            style={[styles.block, styles[swatch.styleKey], swatch.showBorder && styles.blockBorder]}
          />
          <View style={styles.meta}>
            <Text style={styles.name}>{swatch.name}</Text>
            <Text style={styles.value}>{swatch.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Static styles ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.swatch.gridGap,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    borderRadius: tokens.swatch.borderRadius,
    overflow: 'hidden',
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
  },
  block: {
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
  blockBorder: {
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
  },
  meta: {
    paddingVertical: tokens.swatch.metaPaddingVertical,
    paddingHorizontal: tokens.swatch.metaPaddingHorizontal,
    backgroundColor: tokens.colors.background,
  },
  name: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
  },
  value: {
    fontSize: tokens.typography.fontSize.swatchValue,
    color: tokens.colors.textHint,
  },
});
