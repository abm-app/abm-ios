import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';

// ─── Props ───────────────────────────────────────────────────────────────────

interface LoginFieldProps extends TextInputProps {
  designScale: number;
  label: string;
  isPassword?: boolean;
  passwordVisible?: boolean;
  onTogglePasswordVisibility?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

function LoginField({
  designScale,
  label,
  isPassword = false,
  passwordVisible = false,
  onTogglePasswordVisibility,
  style,
  ...inputProps
}: LoginFieldProps) {
  const iconSize = tokens.auth.passwordIconSize * designScale;
  const dynamicStyles = useMemo(() => createDynamicStyles(designScale), [designScale]);

  return (
    <View>
      <Text style={[styles.label, dynamicStyles.label]}>{label}</Text>
      <View style={[styles.shell, dynamicStyles.shell]}>
        <TextInput
          {...inputProps}
          style={[styles.input, dynamicStyles.input, style]}
          placeholderTextColor={tokens.colors.authInputTextMuted}
          secureTextEntry={isPassword && !passwordVisible}
        />
        {isPassword ? (
          <Pressable
            hitSlop={tokens.auth.passwordIconHitSlop}
            onPress={onTogglePasswordVisibility}
            style={[styles.eyeButton, dynamicStyles.eyeButton]}
          >
            <Feather
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={iconSize}
              color={tokens.colors.authIcon}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  label: {
    color: tokens.colors.authLabel,
  },
  shell: {
    backgroundColor: tokens.colors.authInputBg,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.authInputBorder,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    color: tokens.colors.authInputTextStrong,
  },
  eyeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const createDynamicStyles = (designScale: number) =>
  StyleSheet.create({
    label: {
      fontSize: tokens.auth.fieldLabelFontSize * designScale,
      lineHeight: tokens.auth.fieldLabelLineHeight * designScale,
      marginBottom: tokens.auth.fieldLabelMarginBottom * designScale,
    },
    shell: {
      height: tokens.auth.fieldHeight * designScale,
      borderRadius: tokens.auth.fieldRadius * designScale,
      paddingHorizontal: tokens.auth.fieldPaddingHorizontal * designScale,
    },
    input: {
      fontSize: tokens.auth.fieldInputFontSize * designScale,
      lineHeight: tokens.auth.fieldInputLineHeight * designScale,
    },
    eyeButton: {
      width: tokens.auth.passwordIconBox * designScale,
      height: tokens.auth.passwordIconBox * designScale,
    },
  });

export default LoginField;
