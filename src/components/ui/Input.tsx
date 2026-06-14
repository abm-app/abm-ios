import {
  StyleSheet,
  Text,
  TextInput,
  View,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';

import tokens from '@/theme/tokens';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

export default function Input({ label, error, style, ...rest }: InputProps) {
  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={tokens.colors.textHint}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

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
  input: {
    fontSize: tokens.input.fontSize,
    color: tokens.colors.textPrimary,
    backgroundColor: tokens.colors.background,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.borderMd,
    borderRadius: tokens.borderRadius.md,
    paddingVertical: tokens.input.paddingVertical,
    paddingHorizontal: tokens.input.paddingHorizontal,
  },
  inputError: {
    borderColor: tokens.colors.danger,
  },
  error: {
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.danger,
  },
});
