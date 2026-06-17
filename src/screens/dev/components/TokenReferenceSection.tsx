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

const colorEntries = [
  { dt: 'Primary', dd: tokens.colors.primary },
  { dt: 'Secondary', dd: tokens.colors.secondary },
  { dt: 'Border default', dd: tokens.colors.border },
  { dt: 'Border emphasis', dd: tokens.colors.borderMd },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function TokenReferenceSection() {
  return (
    <View style={styles.section}>
      <SectionLabel title="Token Reference" />
      <View style={styles.columns}>
        {[fontEntries, colorEntries].map((entries, idx) => (
          <View key={idx} style={styles.column}>
            {entries.map(entry => (
              <View key={entry.dt} style={styles.entry}>
                <Text style={styles.dt}>{entry.dt}</Text>
                <Text style={styles.dd}>{entry.dd}</Text>
              </View>
            ))}
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
    letterSpacing: tokens.typography.letterSpacing.label,
  },
  dd: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
    marginTop: tokens.spacing.xxs,
  },
});
