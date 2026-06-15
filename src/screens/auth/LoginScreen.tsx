import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { Button, Input, Card } from '@/components/ui';
import { useLogin } from '@/hooks/auth/useLogin';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();

  const isValid = email.trim().length > 0 && password.length > 0;
  const errorMessage = loginMutation.error
    ? 'Invalid email or password. Please try again.'
    : undefined;

  function handleSubmit() {
    if (!isValid) return;
    loginMutation.mutate({ email: email.trim(), password });
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Brand header ──────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.brandName}>ABM</Text>
          <Text style={styles.brandTagline}>Hotel Management</Text>
        </View>

        {/* ── Login card ───────────────────────────────────────────────── */}
        <Card padded style={styles.card}>
          <Text style={styles.cardTitle}>Sign in</Text>
          <Text style={styles.cardSubtitle}>Enter your credentials to access your account.</Text>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="username"
              value={email}
              onChangeText={setEmail}
              error={errorMessage}
            />

            <Input
              label="Password"
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              value={password}
              onChangeText={setPassword}
              rightIcon={
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={tokens.iconSizes.inline}
                  color={tokens.colors.textHint}
                  onPress={() => setShowPassword(prev => !prev)}
                />
              }
            />

            <Button
              label="Sign in"
              onPress={handleSubmit}
              disabled={!isValid}
              loading={loginMutation.isPending}
              style={styles.submitButton}
            />
          </View>
        </Card>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <Text style={styles.footer}>ABM Express &amp; ABM International</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.xlMd,
    paddingVertical: tokens.spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xxlMd,
  },
  brandName: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.display,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.textPrimary,
    letterSpacing: tokens.typography.letterSpacing.display,
  },
  brandTagline: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xs,
    letterSpacing: tokens.typography.letterSpacing.subhead,
  },
  card: {
    width: '100%',
    maxWidth: tokens.input.maxWidth,
    alignSelf: 'center',
  },
  cardTitle: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.modalTitle,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
  },
  cardSubtitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.xlMd,
  },
  form: {
    gap: tokens.form.groupBottomMargin,
  },
  submitButton: {
    marginTop: tokens.spacing.sm,
  },
  footer: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textHint,
    textAlign: 'center',
    marginTop: tokens.spacing.xxlMd,
    letterSpacing: tokens.typography.letterSpacing.subhead,
  },
});
