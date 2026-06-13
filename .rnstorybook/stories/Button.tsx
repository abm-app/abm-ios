import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import tokens from '@/theme/tokens';

export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Optional click handler */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  style,
  onPress,
}: ButtonProps) => {
  const modeStyle = primary ? styles.primary : styles.secondary;
  const textModeStyle = primary ? styles.primaryText : styles.secondaryText;

  const sizeStyle = styles[size];
  const textSizeStyle = textSizeStyles[size];

  const dynamicBackground = backgroundColor
    ? { backgroundColor }
    : undefined;

  return (
    <TouchableOpacity accessibilityRole="button" activeOpacity={0.6} onPress={onPress}>
      <View
        style={[
          styles.button,
          modeStyle,
          sizeStyle,
          style,
          dynamicBackground,
          styles.blackBorder,
        ]}
      >
        <Text style={[textModeStyle, textSizeStyle]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 0,
    borderRadius: tokens.borderRadius.button,
  },
  primary: {
    backgroundColor: tokens.colors.brand,
  },
  primaryText: {
    color: tokens.colors.white,
  },
  secondary: {
    backgroundColor: tokens.colors.transparent,
    borderColor: tokens.colors.border,
    borderWidth: tokens.borderWidth.thin,
  },
  secondaryText: {
    color: tokens.colors.textSecondary,
  },
  blackBorder: {
    borderColor: tokens.colors.primary,
  },
  small: {
    paddingVertical: tokens.button.sm.paddingVertical,
    paddingHorizontal: tokens.button.sm.paddingHorizontal,
  },
  smallText: {
    fontSize: tokens.button.sm.fontSize,
  },
  medium: {
    paddingVertical: tokens.button.md.paddingVertical,
    paddingHorizontal: tokens.button.md.paddingHorizontal,
  },
  mediumText: {
    fontSize: tokens.button.md.fontSize,
  },
  large: {
    paddingVertical: tokens.button.lg.paddingVertical,
    paddingHorizontal: tokens.button.lg.paddingHorizontal,
  },
  largeText: {
    fontSize: tokens.button.lg.fontSize,
  },
});

const textSizeStyles = {
  small: styles.smallText,
  medium: styles.mediumText,
  large: styles.largeText,
};
