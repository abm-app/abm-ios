import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
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
  reachCount: number | null;
}

const WA_BG_URL =
  'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png';

export default function MessageContentStep({
  templates,
  isLoadingTemplates,
  templateId,
  onChangeTemplateId,
  templateVars,
  onChangeTemplateVar,
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

      {currentTemplate ? (
        <View style={styles.previewSection}>
          <ImageBackground
            source={{ uri: WA_BG_URL }}
            style={styles.previewBg}
            imageStyle={styles.previewBgImage}
          >
            <View style={styles.bubble}>
              <View style={styles.tail} />
              <Text style={styles.bubbleText}>{previewText}</Text>
              <Text style={styles.bubbleTime}>09:41 AM</Text>
            </View>
          </ImageBackground>
        </View>
      ) : null}

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
  previewSection: {
    marginBottom: tokens.spacing.mdLg,
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
  },
  previewBg: {
    padding: tokens.spacing.xl,
    backgroundColor: tokens.colors.waWallpaperBg,
  },
  previewBgImage: {
    opacity: 0.4,
  },
  bubble: {
    backgroundColor: tokens.colors.white,
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.lg,
    borderTopLeftRadius: 0,
    position: 'relative',
    ...tokens.shadow.chatBubble,
  },
  tail: {
    position: 'absolute',
    top: 0,
    left: -10,
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderLeftWidth: 10,
    borderTopColor: tokens.colors.white,
    borderLeftColor: 'transparent',
  },
  bubbleText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
    lineHeight: 22,
    marginBottom: tokens.spacing.md,
  },
  bubbleTime: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 10,
    color: tokens.colors.textHint,
    alignSelf: 'flex-end',
  },
  varsCard: {
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
