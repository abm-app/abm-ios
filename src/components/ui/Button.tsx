import {
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps {
  /** Text displayed inside the button. */
  label: string;
  /** Called when the button is pressed. Ignored when `disabled` or `loading` is true. */
  onPress: () => void;
  /** Visual style. `'primary'` renders a solid black fill; `'secondary'` adds a borderMd outline;
   * `'ghost'` is transparent with no border; `'danger'` uses the high-priority badge palette. */
  variant?: ButtonVariant;
  /** Hit-target size. `'md'` (default) for standard buttons; `'sm'` for compact actions. */
  size?: ButtonSize;
  /** Reduces opacity and blocks press events. @default false */
  disabled?: boolean;
  /** Shows an ActivityIndicator spinner and blocks press events. @default false */
  loading?: boolean;
  /** Additional container styles merged after layout defaults. */
  style?: StyleProp<ViewStyle>;
  /** Optional icon name from Feather icons */
  icon?: keyof typeof Feather.glyphMap;
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
  icon,
}: ButtonProps) {
  const loadingColor = variantLabelStyles[variant].color ?? tokens.colors.primary;

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
        <>
          {icon && (
            <Feather
              name={icon}
              size={size === 'sm' ? 14 : 18}
              color={loadingColor as string}
              style={styles.icon}
            />
          )}
          <Text style={[styles.label, variantLabelStyles[variant], sizeLabelStyles[size]]}>
            {label}
          </Text>
        </>
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
  icon: {
    marginRight: tokens.spacing.sm,
  },
});
