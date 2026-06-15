import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';
import SectionLabel from './SectionLabel';

// ─── Data ────────────────────────────────────────────────────────────────────

/* eslint-disable no-restricted-syntax -- display strings for the design-system preview */
const swatches = [
  { name: 'Primary', value: tokens.colors.primary, display: '#000000' },
  { name: 'Secondary', value: tokens.colors.secondary, display: '15% #000' },
  { name: 'Surface', value: tokens.colors.surface, display: '6% #000' },
  {
    name: 'Background',
    value: tokens.colors.background,
    display: '#FFFFFF',
    hasBorder: true,
  },
  { name: 'Danger', value: tokens.colors.danger, display: '#C0392B' },
  { name: 'Success', value: tokens.colors.success, display: '#27AE60' },
  { name: 'Warning', value: tokens.colors.warning, display: '#F59E0B' },
  { name: 'Info', value: tokens.colors.info, display: '#2471A3' },
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
                { backgroundColor: s.value },
                'hasBorder' in s && s.hasBorder ? styles.swatchBlockBorder : null,
              ]}
            />
            <View style={styles.swatchMeta}>
              <Text style={styles.swatchName}>{s.name}</Text>
              <Text style={styles.swatchHex}>{s.display}</Text>
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
