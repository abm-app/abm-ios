import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';
import { LoginField } from './LoginField';

// ─── Props ───────────────────────────────────────────────────────────────────

interface LoginCardProps {
  designScale: number;
  identifier: string;
  password: string;
  submitting: boolean;
  onIdentifierChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LoginCard({
  designScale,
  identifier,
  password,
  submitting,
  onIdentifierChange,
  onPasswordChange,
  onSubmit,
}: LoginCardProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const cardHeight = tokens.auth.cardHeight * designScale;
  const cardRadius = tokens.auth.cardRadius * designScale;
  const cardPaddingHorizontal = tokens.auth.cardPaddingHorizontal * designScale;
  const cardPaddingVertical = tokens.auth.cardPaddingVertical * designScale;
  const titleFontSize = tokens.auth.titleFontSize * designScale;
  const titleLineHeight = tokens.auth.titleLineHeight * designScale;
  const titleMarginBottom = tokens.auth.titleMarginBottom * designScale;
  const fieldGap = tokens.auth.fieldGap * designScale;
  const submitHeight = tokens.auth.submitHeight * designScale;
  const submitRadius = tokens.auth.submitRadius * designScale;
  const submitMarginTop = tokens.auth.submitMarginTop * designScale;
  const submitFontSize = tokens.auth.submitFontSize * designScale;
  const submitLineHeight = tokens.auth.submitLineHeight * designScale;

  return (
    <View
      style={[
        styles.card,
        {
          height: cardHeight,
          borderRadius: cardRadius,
          paddingHorizontal: cardPaddingHorizontal,
          paddingVertical: cardPaddingVertical,
        },
      ]}
    >
      <Text
        style={[
          styles.cardTitle,
          {
            fontSize: titleFontSize,
            lineHeight: titleLineHeight,
            marginBottom: titleMarginBottom,
          },
        ]}
      >
        Welcome Back!
      </Text>

      <LoginField
        designScale={designScale}
        label="Username"
        placeholder="you@abm.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={identifier}
        onChangeText={onIdentifierChange}
        returnKeyType="next"
      />

      <View style={{ height: fieldGap }} />

      <LoginField
        designScale={designScale}
        label="Password"
        isPassword
        passwordVisible={passwordVisible}
        style={styles.passwordInput}
        placeholder="••••••••"
        value={password}
        onChangeText={onPasswordChange}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        onTogglePasswordVisibility={() => setPasswordVisible(current => !current)}
      />
      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          {
            height: submitHeight,
            borderRadius: submitRadius,
            marginTop: submitMarginTop,
          },
          pressed && !submitting ? styles.submitButtonPressed : null,
          submitting ? styles.submitButtonDisabled : null,
        ]}
        onPress={onSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={tokens.colors.textInverse} />
        ) : (
          <Text
            style={[
              styles.submitText,
              {
                fontSize: submitFontSize,
                lineHeight: submitLineHeight,
              },
            ]}
          >
            Login
          </Text>
        )}
      </Pressable>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: tokens.colors.authCardSurface,
    ...tokens.shadow.authCard,
    elevation: 6,
  },
  cardTitle: {
    color: tokens.colors.authInk,
    fontFamily: tokens.typography.fontFamily.headingBold,
    textAlign: 'center',
  },
  passwordInput: {
    letterSpacing: tokens.typography.letterSpacing.subhead,
  },
  submitButton: {
    width: '100%',
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonPressed: {
    opacity: tokens.opacity.pressed,
  },
  submitButtonDisabled: {
    opacity: tokens.opacity.buttonDisabled,
  },
  submitText: {
    color: tokens.colors.textInverse,
    fontWeight: '600',
  },
});
