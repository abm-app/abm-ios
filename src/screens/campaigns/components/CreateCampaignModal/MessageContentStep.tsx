import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import tokens from '@/theme/tokens';
import { Chip } from '@/components/ui';
import type { MetaTemplate } from '@/types/campaign';
import { MetaContent } from '@/components/shared';

interface MessageContentStepProps {
  templates: MetaTemplate[] | undefined;
  isLoadingTemplates: boolean;
  templateId: string;
  onChangeTemplateId: (id: string) => void;
  templateVars: Record<string, string>;
  currentTemplate: MetaTemplate | undefined;
  reachCount: number | null;
}

export default function MessageContentStep({
  templates,
  isLoadingTemplates,
  templateId,
  onChangeTemplateId,
  templateVars,
  currentTemplate,
}: MessageContentStepProps) {
  // Replace variables in the template body or leave as {{var}} if not filled
  const previewText = currentTemplate?.body.replace(/\{\{([^}]+)\}\}/g, (match, p1) => {
    return templateVars[p1] && templateVars[p1].trim() !== '' ? templateVars[p1] : match;
  });

  return (
    <View style={styles.container}>
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

      {currentTemplate ? <MetaContent body={previewText} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: tokens.spacing.xl,
  },
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

  infoBanner: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.bannerWarningBg,
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.md,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.bannerWarningBorder,
  },
  infoIcon: {
    marginRight: tokens.spacing.sm,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    color: tokens.colors.textMuted,
    lineHeight: 20,
  },
});
