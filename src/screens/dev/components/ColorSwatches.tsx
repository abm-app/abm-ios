import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';

// ─── Swatch data ─────────────────────────────────────────────────────────────

/* eslint-disable no-restricted-syntax -- display strings for the design-system preview */
const swatches = [
  { name: 'Primary', value: '#000000', color: tokens.colors.primary, showBorder: false },
  { name: 'Secondary', value: '15% #000', color: tokens.colors.secondary, showBorder: false },
  { name: 'Surface', value: '6% #000', color: tokens.colors.surface, showBorder: false },
  {
    name: 'Background',
    value: '#FFFFFF',
    color: tokens.colors.background,
    showBorder: true,
  },
  { name: 'Danger', value: '#C0392B', color: tokens.colors.danger, showBorder: false },
  { name: 'Success', value: '#27AE60', color: tokens.colors.success, showBorder: false },
  { name: 'Warning', value: '#F59E0B', color: tokens.colors.warning, showBorder: false },
  { name: 'Info', value: '#2471A3', color: tokens.colors.info, showBorder: false },
] as const;
/* eslint-enable no-restricted-syntax */

// ─── Component ───────────────────────────────────────────────────────────────

export default function ColorSwatches() {
  return (
    <View style={styles.grid}>
      {swatches.map(swatch => (
        <View key={swatch.name} style={styles.card}>
          <View
            style={[
              styles.block,
              { backgroundColor: swatch.color },
              swatch.showBorder && styles.blockBorder,
            ]}
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
