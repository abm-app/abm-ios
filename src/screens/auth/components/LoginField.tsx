import React from 'react';
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

export function LoginField({
  designScale,
  label,
  isPassword = false,
  passwordVisible = false,
  onTogglePasswordVisibility,
  style,
  ...inputProps
}: LoginFieldProps) {
  const labelFontSize = tokens.auth.fieldLabelFontSize * designScale;
  const labelLineHeight = tokens.auth.fieldLabelLineHeight * designScale;
  const fieldHeight = tokens.auth.fieldHeight * designScale;
  const fieldRadius = tokens.auth.fieldRadius * designScale;
  const fieldPaddingHorizontal = tokens.auth.fieldPaddingHorizontal * designScale;
  const inputFontSize = 16 * designScale;
  const inputLineHeight = 22 * designScale;
  const iconBox = tokens.auth.passwordIconBox * designScale;
  const iconSize = tokens.auth.passwordIconSize * designScale;

  return (
    <View>
      <Text
        style={[
          styles.label,
          {
            fontSize: labelFontSize,
            lineHeight: labelLineHeight,
            marginBottom: tokens.auth.fieldLabelMarginBottom * designScale,
          },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.shell,
          {
            height: fieldHeight,
            borderRadius: fieldRadius,
            paddingHorizontal: fieldPaddingHorizontal,
          },
        ]}
      >
        <TextInput
          {...inputProps}
          style={[
            styles.input,
            {
              fontSize: inputFontSize,
              lineHeight: inputLineHeight,
            },
            style,
          ]}
          placeholderTextColor={tokens.colors.authInputTextMuted}
          secureTextEntry={isPassword && !passwordVisible}
        />
        {isPassword ? (
          <Pressable
            hitSlop={tokens.auth.passwordIconHitSlop}
            onPress={onTogglePasswordVisibility}
            style={[styles.eyeButton, { width: iconBox, height: iconBox }]}
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
