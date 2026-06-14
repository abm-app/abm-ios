import { StyleSheet, Text, TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';

import tokens from '@/theme/tokens';

type ChipTone = 'default' | 'primary' | 'warning';

export interface ChipProps {
  label: string;
  active?: boolean;
  tone?: ChipTone;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const activeStyles: Record<ChipTone, { bg: string; border: string; text: string }> = {
  default: {
    bg: tokens.colors.background,
    border: tokens.colors.borderMd,
    text: tokens.colors.textSecondary,
  },
  primary: {
    bg: tokens.colors.primary,
    border: tokens.colors.primary,
    text: tokens.colors.background,
  },
  warning: {
    bg: tokens.colors.warning,
    border: tokens.colors.warning,
    text: tokens.colors.background,
  },
};

export default function Chip({
  label,
  active = false,
  tone = 'default',
  onPress,
  style,
}: ChipProps) {
  const activeStyle = activeStyles[tone];

  const containerStyle = active
    ? {
        backgroundColor: activeStyle.bg,
        borderColor: activeStyle.border,
      }
    : {
        backgroundColor: tokens.colors.background,
        borderColor: tokens.colors.borderMd,
      };

  const textStyle = active ? { color: activeStyle.text } : { color: tokens.colors.textSecondary };

  const content = <Text style={[styles.base, containerStyle, textStyle]}>{label}</Text>;

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={style}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={style}>{content}</View>;
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    fontSize: tokens.chip.fontSize,
    fontWeight: tokens.chip.fontWeight,
    paddingVertical: tokens.chip.paddingVertical,
    paddingHorizontal: tokens.chip.paddingHorizontal,
    borderRadius: tokens.borderRadius.pill,
    borderWidth: tokens.borderWidth.thin,
  },
});
