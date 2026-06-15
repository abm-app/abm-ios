import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';

// ─── Reference data ──────────────────────────────────────────────────────────

const leftColumn = [
  { term: 'Font — Heading', definition: 'Ancizar Serif, 400' },
  { term: 'Font — Subheading', definition: 'Inter, 600' },
  { term: 'Font — Body / UI', definition: 'SF Pro Text / System UI' },
  { term: 'Font — Numeric', definition: 'Inter, 300' },
] as const;

const rightColumn = [
  { term: 'Primary', definition: '#000000' },
  { term: 'Secondary', definition: 'rgba(0,0,0,0.15)' },
  { term: 'Border default', definition: 'rgba(0,0,0,0.10)' },
  { term: 'Border emphasis', definition: 'rgba(0,0,0,0.18)' },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function TokenReference() {
  return (
    <View style={styles.grid}>
      <View style={styles.column}>
        {leftColumn.map(item => (
          <View key={item.term} style={styles.entry}>
            <Text style={styles.term}>{item.term}</Text>
            <Text style={styles.definition}>{item.definition}</Text>
          </View>
        ))}
      </View>
      <View style={styles.column}>
        {rightColumn.map(item => (
          <View key={item.term} style={styles.entry}>
            <Text style={styles.term}>{item.term}</Text>
            <Text style={styles.definition}>{item.definition}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Static styles ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: tokens.spacing.lgMd,
  },
  column: {
    flex: 1,
  },
  entry: {
    marginBottom: tokens.spacing.mdLg,
  },
  term: {
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
    textTransform: 'uppercase',
    letterSpacing: 0.77,
    marginBottom: tokens.spacing.xxs,
  },
  definition: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
  },
});
