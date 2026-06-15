import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';

// ─── Radius data ─────────────────────────────────────────────────────────────

const radiusItems = [
  { label: 'sm\n6px', value: tokens.borderRadius.sm },
  { label: 'md\n10px', value: tokens.borderRadius.md },
  { label: 'lg\n16px', value: tokens.borderRadius.lg },
  { label: 'xl\n24px', value: tokens.borderRadius.xl },
  { label: 'pill\n100px', value: tokens.borderRadius.pill },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function RadiusScale() {
  return (
    <View style={styles.row}>
      {radiusItems.map(item => (
        <View key={item.label} style={styles.item}>
          <View style={[styles.box, { borderRadius: item.value }]} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Static styles ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
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
  label: {
    fontSize: tokens.typography.fontSize.swatchValue,
    color: tokens.colors.textHint,
    textAlign: 'center',
  },
});
