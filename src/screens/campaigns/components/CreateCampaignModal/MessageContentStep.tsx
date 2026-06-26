import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import tokens from '@/theme/tokens';
import { Input, Chip, Card } from '@/components/ui';
import type { MetaTemplate } from '@/types/campaign';

interface MessageContentStepProps {
  templates: MetaTemplate[] | undefined;
  isLoadingTemplates: boolean;
  templateId: string;
  onChangeTemplateId: (id: string) => void;
  templateVars: Record<string, string>;
  onChangeTemplateVar: (v: string, text: string) => void;
  currentTemplate: MetaTemplate | undefined;
}

export default function MessageContentStep({
  templates,
  isLoadingTemplates,
  templateId,
  onChangeTemplateId,
  templateVars,
  onChangeTemplateVar,
  currentTemplate,
}: MessageContentStepProps) {
  return (
    <View>
      <Text style={styles.sectionLabel}>SELECT TEMPLATE</Text>
      {isLoadingTemplates ? (
        <ActivityIndicator size="small" color={tokens.colors.primary} style={styles.loader} />
      ) : (
        <View style={styles.chipGroup}>
          {templates?.map(t => (
            <Chip
              key={t.id}
              label={t.label}
              active={templateId === t.id}
              tone="primary"
              onPress={() => onChangeTemplateId(t.id)}
            />
          ))}
        </View>
      )}

      {currentTemplate?.vars.length ? (
        <Card padded style={styles.varsCard}>
          <Text style={styles.cardTitle}>Dynamic Variables</Text>
          {currentTemplate.vars.map(v => (
            <Input
              key={v}
              label={v}
              placeholder={`Enter value for ${v}`}
              value={templateVars[v] || ''}
              onChangeText={text => onChangeTemplateVar(v, text)}
              style={styles.field}
            />
          ))}
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: '600',
    color: tokens.colors.textHint,
    letterSpacing: 1,
    marginBottom: tokens.spacing.md,
  },
  loader: {
    alignSelf: 'flex-start',
    marginBottom: tokens.spacing.mdLg,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.mdLg,
  },
  varsCard: {
    marginTop: tokens.spacing.sm,
    marginBottom: tokens.spacing.mdLg,
    backgroundColor: tokens.colors.surface,
  },
  cardTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.md,
  },
  field: {
    marginBottom: tokens.spacing.mdLg,
  },
});
