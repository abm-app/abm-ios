import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { useLogin } from '@/hooks/auth/useLogin';
import { Backdrop, AlertModal } from '@/components/shared';
import LoginCard from './components/LoginCard';
import LpaiLogo from '../../../assets/lpai.svg';
import AbmLogo from '../../../assets/logos/abm-logo.svg';

// ─── Layout reference (unscaled) ─────────────────────────────────────────────

const REFERENCE_WIDTH = tokens.auth.referenceWidth;
const REFERENCE_HEIGHT = tokens.auth.referenceHeight;

// ─── Component ───────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const loginMutation = useLogin();

  const designScale = Math.min(width / REFERENCE_WIDTH, height / REFERENCE_HEIGHT, 1);
  const dynamicStyles = useMemo(
    () => createDynamicStyles(designScale, height),
    [designScale, height],
  );

  function handleSubmit() {
    const resolvedIdentifier = identifier.trim().toLowerCase();

    if (!resolvedIdentifier || !password) {
      return;
    }

    loginMutation.mutate(
      { email: resolvedIdentifier, password },
      {
        onError: error => {
          const humanReadableMessage =
            error.response?.data?.error || error.message || 'Check your credentials and try again.';

          setAlertMessage(humanReadableMessage);
        },
      },
    );
  }

  return (
    <View style={styles.root}>
      <Backdrop />

      <KeyboardAvoidingView style={styles.keyboardRoot} behavior="padding">
        <View style={[styles.content, dynamicStyles.content]}>
          {/* ── Brand area ──────────────────────────────────────────────── */}
          <View style={[styles.brandRow, dynamicStyles.brandRow]}>
            <AbmLogo
              width={tokens.auth.brandLogoSize * designScale}
              height={tokens.auth.brandLogoSize * designScale}
            />
          </View>

          {/* ── Login card ──────────────────────────────────────────────── */}
          <View style={[styles.cardPosition, dynamicStyles.cardPosition]}>
            <LoginCard
              designScale={designScale}
              identifier={identifier}
              password={password}
              submitting={loginMutation.isPending}
              onIdentifierChange={setIdentifier}
              onPasswordChange={setPassword}
              onSubmit={handleSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, dynamicStyles.footerText]}>Powered by</Text>
        <LpaiLogo
          width={tokens.auth.logoWidth * designScale}
          height={tokens.auth.logoHeight * designScale}
        />
      </View>

      <AlertModal
        visible={!!alertMessage}
        onClose={() => setAlertMessage(null)}
        title="Login failed"
        content={alertMessage}
        iconVariant="danger"
        icon={<Feather name="alert-circle" size={32} color={tokens.colors.danger} />}
      />
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

const createDynamicStyles = (designScale: number, windowHeight: number) =>
  StyleSheet.create({
    content: {
      height: windowHeight,
    },
    brandRow: {
      top: tokens.auth.brandTop * designScale,
    },
    cardPosition: {
      top: tokens.auth.cardTop * designScale,
      width: tokens.auth.cardWidth * designScale,
    },
    footerText: {
      fontSize: tokens.typography.fontSize.caption * designScale,
    },
  });
