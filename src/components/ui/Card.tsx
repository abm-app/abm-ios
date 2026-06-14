import type { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';

import tokens from '@/theme/tokens';

export interface CardProps {
  children: ReactNode;
  padded?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

// ─── Pre-created token-derived style maps (module-level, computed once) ──────

const paddedStyle: ViewStyle = {
  paddingVertical: tokens.statCard.paddingVertical,
  paddingHorizontal: tokens.statCard.paddingHorizontal,
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Card({ children, padded = false, onPress, style }: CardProps) {
  const content = <View style={[styles.base, padded && paddedStyle, style]}>{children}</View>;

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

// ─── Static base styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    backgroundColor: tokens.colors.background,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
  },
});
