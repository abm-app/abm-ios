import type { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
  TextInputProps,
} from 'react-native';

import tokens from '@/theme/tokens';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Optional label rendered above the input field using the Label typography style
   * (Inter, 11, semibold, uppercase). */
  label?: string;
  /** Error message rendered below the input. When present the field border switches to the
   * danger color and the message appears in danger text. An empty or undefined value clears
   * the error state. */
  error?: string;
  /** Node rendered at the trailing edge of the input row (e.g. an icon). */
  rightIcon?: ReactNode;
  /** Additional wrapper styles merged after the default layout. */
  style?: StyleProp<ViewStyle>;
}

// ─── Pre-created token-derived style maps (module-level, computed once) ──────

const errorInputStyle: ViewStyle = {
  borderColor: tokens.colors.danger,
};

const errorTextStyle: TextStyle = {
  color: tokens.colors.danger,
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Input({
  label,
  error,
  rightIcon,
  style,
  editable = true,
  ...rest
}: InputProps) {
  const hasError = Boolean(error);

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, !editable && styles.inputRowDisabled]}>
        <TextInput
          style={[
            styles.input,
            rightIcon ? styles.inputWithIcon : null,
            hasError ? errorInputStyle : null,
            !editable ? styles.inputDisabled : null,
          ]}
          placeholderTextColor={tokens.colors.textHint}
          editable={editable}
          {...rest}
        />
        {rightIcon ? <View style={styles.iconWrapper}>{rightIcon}</View> : null}
      </View>
      {hasError ? <Text style={errorTextStyle}>{error}</Text> : null}
    </View>
  );
}

// ─── Static base styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    gap: tokens.form.labelBottomMargin,
  },
  label: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
    letterSpacing: tokens.typography.letterSpacing.label,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.borderMd,
    borderRadius: tokens.borderRadius.md,
    backgroundColor: tokens.colors.background,
  },
  inputRowDisabled: {
    opacity: tokens.opacity.disabled,
  },
  input: {
    flex: 1,
    fontSize: tokens.input.fontSize,
    color: tokens.colors.textPrimary,
    paddingVertical: tokens.input.paddingVertical,
    paddingHorizontal: tokens.input.paddingHorizontal,
  },
  inputWithIcon: {
    paddingRight: tokens.spacing.sm,
  },
  inputDisabled: {
    color: tokens.colors.textHint,
  },
  iconWrapper: {
    paddingRight: tokens.input.paddingHorizontal,
  },
});
