import React, { useMemo, useState } from 'react';
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
  const dynamicStyles = useMemo(() => createDynamicStyles(designScale), [designScale]);

  return (
    <View style={[styles.card, dynamicStyles.card]}>
      <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>Welcome Back!</Text>

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

      <View style={dynamicStyles.spacer} />

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
          dynamicStyles.submitButton,
          pressed && !submitting ? styles.submitButtonPressed : null,
          submitting ? styles.submitButtonDisabled : null,
        ]}
        onPress={onSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={tokens.colors.textInverse} />
        ) : (
          <Text style={[styles.submitText, dynamicStyles.submitText]}>Login</Text>
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
    fontWeight: tokens.typography.fontWeight.semibold,
  },
});

const createDynamicStyles = (designScale: number) =>
  StyleSheet.create({
    card: {
      height: tokens.auth.cardHeight * designScale,
      borderRadius: tokens.auth.cardRadius * designScale,
      paddingHorizontal: tokens.auth.cardPaddingHorizontal * designScale,
      paddingVertical: tokens.auth.cardPaddingVertical * designScale,
    },
    cardTitle: {
      fontSize: tokens.auth.titleFontSize * designScale,
      lineHeight: tokens.auth.titleLineHeight * designScale,
      marginBottom: tokens.auth.titleMarginBottom * designScale,
    },
    spacer: {
      height: tokens.auth.fieldGap * designScale,
    },
    submitButton: {
      height: tokens.auth.submitHeight * designScale,
      borderRadius: tokens.auth.submitRadius * designScale,
      marginTop: tokens.auth.submitMarginTop * designScale,
    },
    submitText: {
      fontSize: tokens.auth.submitFontSize * designScale,
      lineHeight: tokens.auth.submitLineHeight * designScale,
    },
  });
