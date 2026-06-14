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
  label?: string;
  error?: string;
  rightIcon?: ReactNode;
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
