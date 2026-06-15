import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

import tokens from '@/theme/tokens';

export type ChipTone = 'default' | 'primary' | 'warning';

export interface ChipProps {
  /** Text displayed inside the chip. */
  label: string;
  /** When true the chip renders with its active appearance (filled background and border).
   * When false or omitted, the chip shows an inactive outline style. */
  active?: boolean;
  /** Active color tone. `'primary'` fills black with white text; `'warning'` fills amber
   * with white text; `'default'` uses the inactive outline palette regardless of `active`. */
  tone?: ChipTone;
  /** When provided the chip renders as a pressable element; when omitted it renders as a
   * static View. */
  onPress?: () => void;
  /** Additional container styles merged after chip defaults. */
  style?: StyleProp<ViewStyle>;
}

// ─── Pre-created token-derived style maps (module-level, computed once) ──────

const toneContainerStyles: Record<ChipTone, ViewStyle> = {
  default: {
    backgroundColor: tokens.colors.background,
    borderColor: tokens.colors.borderMd,
  },
  primary: {
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.primary,
  },
  warning: {
    backgroundColor: tokens.colors.warning,
    borderColor: tokens.colors.warning,
  },
};

const toneLabelStyles: Record<ChipTone, TextStyle> = {
  default: {
    color: tokens.colors.textSecondary,
  },
  primary: {
    color: tokens.colors.background,
  },
  warning: {
    color: tokens.colors.background,
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Chip({
  label,
  active = false,
  tone = 'default',
  onPress,
  style,
}: ChipProps) {
  const containerStyle = active ? toneContainerStyles[tone] : toneContainerStyles.default;
  const textStyle = active ? toneLabelStyles[tone] : toneLabelStyles.default;

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

// ─── Static base styles ──────────────────────────────────────────────────────

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
