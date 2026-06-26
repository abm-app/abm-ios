import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { Card, Chip, Button } from '@/components/ui';

export interface PendingAction {
  id: string;
  title: string;
  audience: string;
  creator: string;
  status: string;
}

interface ActionRequiredCardProps {
  action: PendingAction;
}

export default function ActionRequiredCard({ action }: ActionRequiredCardProps) {
  return (
    <Card padded style={styles.card}>
      {action.status === 'pending' && (
        <View style={styles.chipRow}>
          <Chip
            label="Pending Senior Approval"
            active
            tone="warning"
            textColor={tokens.colors.primary}
          />
        </View>
      )}
      <Text style={styles.title}>{action.title}</Text>
      <View style={styles.metaRow}>
        <Feather name="users" size={tokens.iconSizes.content} color={tokens.colors.textMuted} />
        <Text style={styles.metaText}>{action.audience}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Created by {action.creator}</Text>
        <Button label="Review" variant="primary" size="sm" onPress={() => {}} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: tokens.spacing.mdLg,
  },
  chipRow: {
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.sm,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  metaText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
  },
  divider: {
    height: tokens.borderWidth.thin,
    backgroundColor: tokens.colors.border,
    marginBottom: tokens.spacing.mdLg,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
});
