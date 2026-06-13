import {
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import tokens from '@/theme/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'sm';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; label: string }> = {
  primary: {
    container: { backgroundColor: tokens.colors.primary },
    label: tokens.colors.white,
  },
  secondary: {
    container: {
      backgroundColor: tokens.colors.white,
      borderWidth: tokens.borderWidth.hairline,
      borderColor: tokens.colors.primary,
    },
    label: tokens.colors.primary,
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: tokens.colors.primary,
  },
  danger: {
    container: { backgroundColor: tokens.colors.danger },
    label: tokens.colors.white,
  },
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const { container: vContainer, label: vLabel } = variantStyles[variant];
  const s = tokens.button[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        { paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal },
        vContainer,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={vLabel} />
      ) : (
        <Text style={[styles.label, { color: vLabel, fontSize: s.fontSize }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
});
