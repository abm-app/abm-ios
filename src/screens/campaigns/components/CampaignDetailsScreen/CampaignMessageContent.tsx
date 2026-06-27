import React from 'react';
import { Text, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import MetaContent from '@/components/shared/MetaContent';

interface Props {
  messageBody: string;
}

export default function CampaignMessageContent({ messageBody }: Props) {
  return (
    <Card padded style={styles.card}>
      <Text style={styles.sectionTitle}>MESSAGE CONTENT</Text>

      <MetaContent body={messageBody} time="09:41 AM" />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: tokens.spacing.mdLg,
  },
  sectionTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.sectionLabel,
    fontWeight: '700',
    color: tokens.colors.textSecondary,
    letterSpacing: tokens.typography.letterSpacing.sectionLabel,
    marginBottom: tokens.spacing.md,
  },
});
