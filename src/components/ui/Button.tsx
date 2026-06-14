import {
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';

import tokens from '@/theme/tokens';
import { useTokens } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ─── Pre-created token-derived style maps (module-level, computed once) ──────

const variantContainerStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: tokens.colors.primary,
  },
  secondary: {
    backgroundColor: tokens.colors.background,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.borderMd,
  },
  ghost: {
    backgroundColor: tokens.colors.transparent,
  },
  danger: {
    backgroundColor: tokens.colors.badgeHighBg,
  },
};

const variantLabelStyles: Record<ButtonVariant, TextStyle> = {
  primary: { color: tokens.colors.background },
  secondary: { color: tokens.colors.primary },
  ghost: { color: tokens.colors.primary },
  danger: { color: tokens.colors.badgeHighText },
};

const sizeContainerStyles: Record<ButtonSize, ViewStyle> = {
  md: {
    paddingVertical: tokens.spacing.smMd,
    paddingHorizontal: tokens.spacing.xl,
    borderRadius: tokens.borderRadius.md,
  },
  sm: {
    paddingVertical: tokens.spacing.xsMd,
    paddingHorizontal: tokens.spacing.mdLg,
    borderRadius: tokens.borderRadius.sm,
  },
};

const sizeLabelStyles: Record<ButtonSize, TextStyle> = {
  md: {
    fontSize: tokens.typography.fontSize.button,
  },
  sm: {
    fontSize: tokens.typography.fontSize.buttonSm,
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const t = useTokens();

  // useTokens() provides dynamic token access — loading spinner color
  // resolves from the module-level variantLabelStyles map.
  const loadingColor = variantLabelStyles[variant].color ?? t.colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        sizeContainerStyles[size],
        variantContainerStyles[variant],
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={loadingColor} />
      ) : (
        <Text style={[styles.label, variantLabelStyles[variant], sizeLabelStyles[size]]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Static base styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    fontWeight: tokens.typography.fontWeight.medium,
    letterSpacing: tokens.typography.letterSpacing.button,
  },
  disabled: {
    opacity: tokens.opacity.disabled,
  },
});
