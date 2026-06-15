import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';
import SectionLabel from './SectionLabel';

// ─── Data ────────────────────────────────────────────────────────────────────

const fontEntries = [
  { dt: 'Font — Heading', dd: 'Ancizar Serif, 400' },
  { dt: 'Font — Subheading', dd: 'Inter, 600' },
  { dt: 'Font — Body / UI', dd: 'SF Pro Text / System UI' },
  { dt: 'Font — Numeric', dd: 'Inter, 300' },
];

/* eslint-disable no-restricted-syntax -- display strings for the design-system preview */
const colorEntries = [
  { dt: 'Primary', dd: '#000000' },
  { dt: 'Secondary', dd: 'rgba(0,0,0,0.15)' },
  { dt: 'Border default', dd: 'rgba(0,0,0,0.10)' },
  { dt: 'Border emphasis', dd: 'rgba(0,0,0,0.18)' },
];
/* eslint-enable no-restricted-syntax */

// ─── Component ───────────────────────────────────────────────────────────────

export default function TokenReferenceSection() {
  return (
    <View style={styles.section}>
      <SectionLabel title="Token Reference" />
      <View style={styles.columns}>
        <View style={styles.column}>
          {fontEntries.map(entry => (
            <View key={entry.dt} style={styles.entry}>
              <Text style={styles.dt}>{entry.dt}</Text>
              <Text style={styles.dd}>{entry.dd}</Text>
            </View>
          ))}
        </View>
        <View style={styles.column}>
          {colorEntries.map(entry => (
            <View key={entry.dt} style={styles.entry}>
              <Text style={styles.dt}>{entry.dt}</Text>
              <Text style={styles.dd}>{entry.dd}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  section: {
    marginBottom: tokens.dsSection.marginBottom,
  },
  columns: {
    flexDirection: 'row',
    gap: tokens.spacing.lgMd,
  },
  column: {
    flex: 1,
  },
  entry: {
    marginTop: tokens.spacing.md,
  },
  dt: {
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
    textTransform: 'uppercase',
    letterSpacing: 0.77, // 11 × 0.07
  },
  dd: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
    marginTop: tokens.spacing.xxs,
  },
});
