import { StyleSheet, Text, StyleProp, TextStyle } from 'react-native';

import tokens from '@/theme/tokens';

type BadgeVariant = 'high' | 'medium' | 'low' | 'category';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<TextStyle>;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  high: {
    bg: tokens.colors.badgeHighBg,
    text: tokens.colors.badgeHighText,
  },
  medium: {
    bg: tokens.colors.badgeMedBg,
    text: tokens.colors.badgeMedText,
  },
  low: {
    bg: tokens.colors.badgeLowBg,
    text: tokens.colors.badgeLowText,
  },
  category: {
    bg: tokens.colors.badgeCatBg,
    text: tokens.colors.badgeCatText,
  },
};

export default function Badge({ label, variant = 'category', style }: BadgeProps) {
  const { bg, text } = variantStyles[variant];

  return <Text style={[styles.base, { backgroundColor: bg, color: text }, style]}>{label}</Text>;
}

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
