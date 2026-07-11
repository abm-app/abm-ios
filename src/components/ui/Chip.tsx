import { Feather } from '@expo/vector-icons';
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
export type ChipVariant = 'default' | 'filter';

export interface ChipProps {
  /** Text displayed inside the chip. */
  label: string;
  /** When true the chip renders with its active appearance (filled background and border).
   * When false or omitted, the chip shows an inactive outline style. */
  active?: boolean;
  /** Active color tone. `'primary'` fills black with white text; `'warning'` fills amber
   * with white text; `'default'` uses the inactive outline palette regardless of `active`. */
  tone?: ChipTone;
  /** The visual variant of the chip. `'default'` is a small pill; `'filter'` is a large card-like chip with an icon. */
  variant?: ChipVariant;
  /** When provided the chip renders as a pressable element; when omitted it renders as a
   * static View. */
  onPress?: () => void;
  /** Additional container styles merged after chip defaults. */
  style?: StyleProp<ViewStyle>;
  /** Custom text color override. */
  textColor?: string;
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
    backgroundColor: tokens.colors.warningSurface,
    borderColor: tokens.colors.warningSurface,
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
    color: tokens.colors.warning,
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Chip({
  label,
  active = false,
  tone = 'default',
  variant = 'default',
  onPress,
  style,
  textColor,
}: ChipProps) {
  // For 'filter' variant, we use specific hardcoded tone behavior that overrides the standard 'tone' prop
  const isFilter = variant === 'filter';

  const containerStyle = isFilter
    ? [styles.filterContainer, active && styles.filterContainerActive]
    : [active ? toneContainerStyles[tone] : toneContainerStyles.default];

  const textStyle = isFilter
    ? [styles.filterLabel, active && styles.filterLabelActive]
    : [active ? toneLabelStyles[tone] : toneLabelStyles.default];

  const content = (
    <>
      <Text style={[!isFilter && styles.label, textStyle, textColor ? { color: textColor } : null]}>
        {label}
      </Text>
      {isFilter && active && (
        <View style={styles.filterIconContainer}>
          <Feather name="check" size={tokens.iconSizes.inline} color={tokens.colors.background} />
        </View>
      )}
    </>
  );

  const baseStyle = isFilter ? null : styles.container;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={tokens.opacity.pressed}
        style={[baseStyle, containerStyle, style]}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[baseStyle, containerStyle, style]}>{content}</View>;
}

// ─── Static base styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    paddingVertical: tokens.chip.paddingVertical,
    paddingHorizontal: tokens.chip.paddingHorizontal,
    borderRadius: tokens.borderRadius.pill,
    borderWidth: tokens.borderWidth.thin,
  },
  label: {
    fontSize: tokens.chip.fontSize,
    fontWeight: tokens.chip.fontWeight,
  },
  // Filter Variant Styles
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lgMd,
    paddingVertical: tokens.spacing.lgMd,
    borderRadius: tokens.borderRadius.lg,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.background,
  },
  filterContainerActive: {
    borderColor: tokens.colors.primary,
  },
  filterLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '500',
    color: tokens.colors.textPrimary,
  },
  filterLabelActive: {
    fontWeight: '600',
  },
  filterIconContainer: {
    width: tokens.spacing.xxl,
    height: tokens.spacing.xxl,
    borderRadius: tokens.spacing.mdLg,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
