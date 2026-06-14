import { StyleSheet, Text, StyleProp, TextStyle } from 'react-native';

import tokens from '@/theme/tokens';

export type BadgeVariant = 'high' | 'medium' | 'low' | 'category';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<TextStyle>;
}

// ─── Pre-created token-derived style maps (module-level, computed once) ──────

const variantStyles: Record<BadgeVariant, TextStyle> = {
  high: {
    backgroundColor: tokens.colors.badgeHighBg,
    color: tokens.colors.badgeHighText,
  },
  medium: {
    backgroundColor: tokens.colors.badgeMedBg,
    color: tokens.colors.badgeMedText,
  },
  low: {
    backgroundColor: tokens.colors.badgeLowBg,
    color: tokens.colors.badgeLowText,
  },
  category: {
    backgroundColor: tokens.colors.badgeCatBg,
    color: tokens.colors.badgeCatText,
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Badge({ label, variant = 'category', style }: BadgeProps) {
  return <Text style={[styles.base, variantStyles[variant], style]}>{label}</Text>;
}

// ─── Static base styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    fontSize: tokens.badge.fontSize,
    fontWeight: tokens.badge.fontWeight,
    lineHeight: tokens.badge.fontSize + tokens.badge.paddingVertical * 2,
    paddingHorizontal: tokens.badge.paddingHorizontal,
    paddingVertical: tokens.badge.paddingVertical,
    borderRadius: tokens.borderRadius.pill,
    letterSpacing: tokens.typography.letterSpacing.badge,
  },
});
