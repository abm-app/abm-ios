import type { ReactNode } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle, Pressable } from 'react-native';

import tokens from '@/theme/tokens';

export interface CardProps {
  /** Content rendered inside the card surface. */
  children: ReactNode;
  /** When true, applies the standard stat-card padding (16v / 20h). When false (default),
   * the card has no inner padding so callers can control layout. */
  padded?: boolean;
  /** The visual style of the card. Defaults to 'outlined' for backwards compatibility. */
  variant?: 'outlined' | 'shadow' | 'shadow-outlined' | 'dark' | 'flat';
  /** Optional specific shadow token to use when variant is 'shadow' or 'shadow-outlined'. Defaults to 'chatBubble'. */
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

  const contentStyles = [
    styles.base,
    variant === 'outlined' && styles.outlined,
    variant === 'shadow' && [styles.shadow, shadowStyle],
    variant === 'shadow-outlined' && [styles.shadow, styles.outlined, shadowStyle],
    variant === 'dark' && styles.dark,
    variant === 'flat' && styles.flat,
    padded && paddedStyle,
    style,
  ];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={contentStyles}>
        {({ pressed }) => (
          <>
            {children}
            {pressed && <View style={styles.pressOverlay} />}
          </>
        )}
      </Pressable>
    );
  }

  return <View style={contentStyles}>{children}</View>;
}

// ─── Static base styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.borderRadius.lg,
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
  pressOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: tokens.colors.pressOverlay,
    borderRadius: tokens.borderRadius.lg,
  },
});
