import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { Chip, Input } from '@/components/ui';
import type { MetaTemplate } from '@/types/campaign';
import { MetaContent } from '@/components/shared';

type VariableSource = 'guest_field' | 'custom';

interface VariableConfig {
  source: VariableSource;
  guestField?: string;
  customValue?: string;
}

const GUEST_FIELD_OPTIONS: {
  label: string;
  value: keyof Pick<
    import('@/types/guest').Guest,
    | 'name'
    | 'phone'
    | 'email'
    | 'tier'
    | 'totalPointsLifetime'
    | 'totalStays'
    | 'source'
    | 'nationalityId'
    | 'lastPropertyName'
  >;
}[] = [
  { label: 'Guest Name', value: 'name' },
  { label: 'Phone Number', value: 'phone' },
  { label: 'Email', value: 'email' },
  { label: 'Tier', value: 'tier' },
  { label: 'Total Points', value: 'totalPointsLifetime' },
  { label: 'Total Stays', value: 'totalStays' },
  { label: 'Source', value: 'source' },
  { label: 'Nationality ID', value: 'nationalityId' },
  { label: 'Last Booked Property', value: 'lastPropertyName' },
];

interface MessageContentStepProps {
  templates: MetaTemplate[] | undefined;
  isLoadingTemplates: boolean;
  templateId: string;
  onChangeTemplateId: (id: string) => void;
  variableConfigs: Record<string, VariableConfig>;
  onUpdateVariableConfig: (key: string, config: VariableConfig) => void;
  currentTemplate: MetaTemplate | undefined;
  reachCount: number | null;
}

export default function MessageContentStep({
  templates,
  isLoadingTemplates,
  templateId,
  onChangeTemplateId,
  variableConfigs,
  onUpdateVariableConfig,
  currentTemplate,
}: MessageContentStepProps) {
  // Build effective configs: use passed-in configs, falling back to
  // defaults derived from the current template's variables.
  const effectiveConfigs: Record<string, VariableConfig> = currentTemplate?.variables
    ? currentTemplate.variables.reduce<Record<string, VariableConfig>>((acc, v) => {
        acc[v.key] = variableConfigs[v.key] || { source: 'custom', customValue: '' };
        return acc;
      }, {})
    : {};

  // Replace variables in the template body or leave placeholders if not filled.
  // Meta bodies use {{1}} / {{2}} style positional placeholders. When the API
  // returns named variables (e.g. key="customer_name") we also support {name}
  // style placeholders for backwards compatibility.
  const bodyText = currentTemplate?.body || '';
  const previewText = bodyText
    .replace(/\{\{(\d+)\}\}/g, (match, num) => {
      const key = 'var_' + num;
      const config = effectiveConfigs[key];
      let value: string | undefined;
      if (config?.source === 'guest_field' && config.guestField) {
        value = `{${config.guestField}}`;
      } else if (config?.source === 'custom' && config.customValue) {
        value = config.customValue;
      }
      return value && value.trim() !== '' ? value : match;
    })
    .replace(/\{([^}]+)\}/g, (match, p1) => {
      const key = p1.toLowerCase();
      const config = effectiveConfigs[key];
      let value: string | undefined;
      if (config?.source === 'guest_field' && config.guestField) {
        value = `{${config.guestField}}`;
      } else if (config?.source === 'custom' && config.customValue) {
        value = config.customValue;
      }
      return value && value.trim() !== '' ? value : match;
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
              label={t.name}
              active={templateId === t.id}
              tone="primary"
              onPress={() => onChangeTemplateId(t.id)}
            />
          ))}
        </View>
      )}

      {currentTemplate ? (
        <>
          <MetaContent body={previewText} />
          {currentTemplate.variables.length > 0 && (
            <View style={styles.variableSection}>
              <Text style={styles.variableLabel}>Fill in variables</Text>
              {currentTemplate.variables.map(v => {
                const config = effectiveConfigs[v.key] || { source: 'custom', customValue: '' };
                const isGuestField = config.source === 'guest_field';
                return (
                  <View key={v.key} style={styles.variableRow}>
                    <View style={styles.variableHeader}>
                      <Text style={styles.variableLabelSmall}>{v.label}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          onUpdateVariableConfig(v.key, {
                            source: isGuestField ? 'custom' : 'guest_field',
                            guestField: isGuestField ? undefined : 'name',
                            customValue: isGuestField ? config.customValue : '',
                          });
                        }}
                        style={styles.toggleBtn}
                      >
                        <Text
                          style={[
                            styles.toggleText,
                            isGuestField ? styles.toggleTextActive : styles.toggleTextInactive,
                          ]}
                        >
                          {isGuestField ? 'Custom' : 'Guest Field'}
                        </Text>
                        <Feather
                          name={isGuestField ? 'chevron-right' : 'chevron-left'}
                          size={14}
                          color={tokens.colors.textHint}
                        />
                      </TouchableOpacity>
                    </View>
                    {isGuestField ? (
                      <View style={styles.guestFieldRow}>
                        <View style={styles.guestFieldSelect}>
                          {GUEST_FIELD_OPTIONS.map(field => (
                            <TouchableOpacity
                              key={field.value}
                              onPress={() => {
                                onUpdateVariableConfig(v.key, {
                                  source: 'guest_field',
                                  guestField: field.value,
                                  customValue: config.customValue,
                                });
                              }}
                              style={[
                                styles.guestFieldOption,
                                config.guestField === field.value && styles.guestFieldOptionActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.guestFieldOptionText,
                                  config.guestField === field.value &&
                                    styles.guestFieldOptionTextActive,
                                ]}
                              >
                                {field.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <Text style={styles.guestFieldHint}>Resolved per guest at send time</Text>
                      </View>
                    ) : (
                      <Input
                        placeholder={v.label}
                        value={config.customValue || ''}
                        onChangeText={(text: string) => {
                          onUpdateVariableConfig(v.key, {
                            source: 'custom',
                            customValue: text,
                          });
                        }}
                        style={styles.variableInput}
                        autoCapitalize="words"
                      />
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </>
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
  variableSection: {
    marginTop: tokens.spacing.lg,
  },
  variableLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: '600',
    color: tokens.colors.textMuted,
    letterSpacing: 1,
    marginBottom: tokens.spacing.md,
  },
  variableRow: {
    marginBottom: tokens.spacing.md,
  },
  variableInput: {
    backgroundColor: tokens.colors.surface,
  },
  variableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  variableLabelSmall: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
    flex: 1,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.sm,
    backgroundColor: tokens.colors.surfaceLight,
  },
  toggleText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
  toggleTextActive: {
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  toggleTextInactive: {
    color: tokens.colors.textHint,
  },
  guestFieldRow: {
    marginBottom: tokens.spacing.md,
  },
  guestFieldSelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.xs,
    marginBottom: tokens.spacing.xs,
  },
  guestFieldOption: {
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.sm,
    backgroundColor: tokens.colors.surfaceLight,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
  },
  guestFieldOptionActive: {
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.primary,
  },
  guestFieldOptionText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
  guestFieldOptionTextActive: {
    color: tokens.colors.white,
    fontWeight: '600',
  },
  guestFieldHint: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
    marginBottom: tokens.spacing.md,
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
