import type { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';

import tokens from '@/theme/tokens';

export interface CardProps {
  /** Content rendered inside the card surface. */
  children: ReactNode;
  /** When true, applies the standard stat-card padding (16v / 20h). When false (default),
   * the card has no inner padding so callers can control layout. */
  padded?: boolean;
  /** The visual style of the card. Defaults to 'outlined' for backwards compatibility. */
  variant?: 'outlined' | 'shadow' | 'dark' | 'flat';
  /** Optional specific shadow token to use when variant is 'shadow'. Defaults to 'chatBubble'. */
  shadow?: keyof typeof tokens.shadow;
  /** When provided, the card wraps its content in a pressable element. When omitted, the
   * card renders as a static View. */
  onPress?: () => void;
  /** Additional container styles merged after card defaults. */
  style?: StyleProp<ViewStyle>;
}

// ─── Pre-created token-derived style maps (module-level, computed once) ──────

const paddedStyle: ViewStyle = {
  paddingVertical: tokens.statCard.paddingVertical,
  paddingHorizontal: tokens.statCard.paddingHorizontal,
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Card({
  children,
  padded = false,
  variant = 'outlined',
  shadow,
  onPress,
  style,
}: CardProps) {
  const shadowStyle = shadow ? tokens.shadow[shadow] : tokens.shadow.chatBubble;

  const content = (
    <View
      style={[
        styles.base,
        variant === 'outlined' && styles.outlined,
        variant === 'shadow' && [styles.shadow, shadowStyle],
        variant === 'dark' && styles.dark,
        variant === 'flat' && styles.flat,
        padded && paddedStyle,
        style,
      ]}
    >
      {children}
    </View>
  );

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
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
  },
  outlined: {
    backgroundColor: tokens.colors.background,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
  },
  shadow: {
    backgroundColor: tokens.colors.background,
  },
  dark: {
    backgroundColor: tokens.colors.cardDarkBg,
  },
  flat: {
    backgroundColor: tokens.colors.surfaceLight,
  },
});
