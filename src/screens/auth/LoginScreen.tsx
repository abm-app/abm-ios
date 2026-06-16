import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import tokens from '@/theme/tokens';
import { useLogin } from '@/hooks/auth/useLogin';
import LoginBackdrop from './components/LoginBackdrop';
import { LoginCard } from './components/LoginCard';

// ─── Layout reference (unscaled) ─────────────────────────────────────────────

const REFERENCE_WIDTH = tokens.auth.referenceWidth;
const REFERENCE_HEIGHT = tokens.auth.referenceHeight;

// ─── Admin login mock mapping ────────────────────────────────────────────────
// During mock phase, admin mode maps to the owner mock account.
// Replace with a real ADMIN_EMAIL env value once the backend supports it.

const MOCK_ADMIN_EMAIL = 'owner@abm.com';

// ─── Component ───────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const loginMutation = useLogin();

  const designScale = Math.min(width / REFERENCE_WIDTH, height / REFERENCE_HEIGHT, 1);

  function handleSubmit() {
    const resolvedIdentifier = isAdminLogin ? MOCK_ADMIN_EMAIL : identifier.trim().toLowerCase();

    if (!resolvedIdentifier || !password) {
      return;
    }

    loginMutation.mutate(
      { email: resolvedIdentifier, password },
      {
        onError: (error: Error) => {
          Alert.alert('Login failed', error.message || 'Check your credentials and try again.');
        },
      },
    );
  }

  return (
    <View style={styles.root}>
      <LoginBackdrop />

      <KeyboardAvoidingView style={styles.keyboardRoot} behavior="padding">
        <View style={[styles.content, { height }]}>
          {/* ── Brand area ──────────────────────────────────────────────── */}
          <View
            style={[
              styles.brandRow,
              {
                top: tokens.auth.brandTop * designScale,
              },
            ]}
          >
            <Text
              style={[
                styles.brandName,
                {
                  fontSize: tokens.typography.fontSize.display * designScale,
                  lineHeight: tokens.typography.fontSize.display * 1.1 * designScale,
                },
              ]}
            >
              ABM
            </Text>
            <Text
              style={[
                styles.brandTagline,
                {
                  fontSize: tokens.typography.fontSize.subhead * designScale,
                  lineHeight: tokens.typography.fontSize.subhead * 1.6 * designScale,
                },
              ]}
            >
              Hotel Management
            </Text>
          </View>

          {/* ── Login card ──────────────────────────────────────────────── */}
          <View
            style={[
              styles.cardPosition,
              {
                top: tokens.auth.cardTop * designScale,
                width: tokens.auth.cardWidth * designScale,
              },
            ]}
          >
            <LoginCard
              designScale={designScale}
              identifier={identifier}
              password={password}
              isAdminLogin={isAdminLogin}
              submitting={loginMutation.isPending}
              onIdentifierChange={setIdentifier}
              onPasswordChange={setPassword}
              onAdminLoginChange={setIsAdminLogin}
              onSubmit={handleSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <View style={styles.footer}>
        <Text
          style={[
            styles.footerText,
            { fontSize: tokens.typography.fontSize.caption * designScale },
          ]}
        >
          Powered by
        </Text>
        <Text
          style={[
            styles.footerBrand,
            {
              fontSize: tokens.typography.fontSize.body * designScale,
              lineHeight: tokens.typography.fontSize.body * 1.4 * designScale,
            },
          ]}
        >
          ABM
        </Text>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.colors.authBackdropBase,
  },
  keyboardRoot: {
    flex: 1,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  brandRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontFamily: tokens.typography.fontFamily.headingBold,
    color: tokens.colors.authBrandInk,
    textAlign: 'center',
    fontWeight: '700',
  },
  brandTagline: {
    fontFamily: tokens.typography.fontFamily.sub,
    color: tokens.colors.authLabel,
    textAlign: 'center',
    marginTop: tokens.spacing.xs,
  },
  cardPosition: {
    position: 'absolute',
    alignSelf: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: tokens.auth.footerBottom,
    alignSelf: 'center',
    alignItems: 'center',
    gap: tokens.spacing.s,
  },
  footerText: {
    fontFamily: tokens.typography.fontFamily.sub,
    color: tokens.colors.textHint,
    textAlign: 'center',
  },
  footerBrand: {
    fontFamily: tokens.typography.fontFamily.headingBold,
    color: tokens.colors.authInk,
    textAlign: 'center',
    fontWeight: '700',
  },
});
