import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { Button, Card } from '@/components/ui';

interface ScorecardErrorProps {
  onRetry: () => void;
}

export default function ScorecardError({ onRetry }: ScorecardErrorProps) {
  return (
    <Card variant="shadow-outlined" shadow="elevatedCard" style={styles.card}>
      <Feather name="file-text" size={tokens.iconSizes.standalone} color={tokens.colors.textHint} />
      <Text style={styles.message}>
        Couldn&apos;t load this report. Check your connection and try again.
      </Text>
      <Button label="Retry" variant="primary" onPress={onRetry} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: tokens.borderRadius.xl,
    paddingVertical: tokens.spacing.xxlMd,
    paddingHorizontal: tokens.spacing.xlMd,
    marginTop: tokens.spacing.xxl,
  },
  message: {
    textAlign: 'center',
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.input,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.sm,
    marginBottom: tokens.spacing.lgMd,
  },
});
