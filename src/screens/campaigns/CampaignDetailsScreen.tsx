import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { Chip } from '@/components/ui';
import { LoadingSpinner, ErrorState } from '@/components/shared';
import CampaignTargetAudience from './components/CampaignDetailsScreen/CampaignTargetAudience';
import CampaignMessageContent from './components/CampaignDetailsScreen/CampaignMessageContent';
import CampaignBottomBar from './components/CampaignDetailsScreen/CampaignBottomBar';
import type { RootStackParamList } from '@/navigation/types';
import { useCampaign, useMetaTemplates } from '@/hooks/campaigns/useCampaigns';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DetailsRouteProp = RouteProp<RootStackParamList, 'CampaignDetails'>;

export default function CampaignDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailsRouteProp>();

  const {
    data: campaign,
    isLoading: isCampLoading,
    isError: isCampError,
    error,
    refetch,
  } = useCampaign(route.params.id);
  const { data: templates, isLoading: isTplLoading } = useMetaTemplates();

  if (isCampLoading || isTplLoading) return <LoadingSpinner />;
  if (isCampError || !campaign)
    return <ErrorState message={error?.message || 'Failed to load campaign'} onRetry={refetch} />;

  const template = templates?.find(t => t.id === campaign.templateId);
  let messageBody = template?.body || 'No message content available.';

  if (campaign.templateVariables && template) {
    Object.entries(campaign.templateVariables).forEach(([_, value]) => {
      messageBody = messageBody.replace(/\{\{[^}]+\}\}/, value);
    });
  }

  // Format status for Chip
  const statusLabel = campaign.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  const isPending = campaign.status === 'pending_approval';

  // Format dates
  const dateStr = new Date(campaign.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={24} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CAMPAIGN DETAILS</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <Text style={styles.title}>{campaign.name}</Text>

        <View style={styles.chipRow}>
          <Chip
            label={statusLabel}
            active={isPending}
            tone={isPending ? 'warning' : 'primary'}
            textColor={isPending ? tokens.colors.primary : undefined}
          />
        </View>

        <Text style={styles.subtitle}>
          Submitted by: {campaign.createdBy} on {dateStr}
        </Text>

        {/* Content Cards */}
        <CampaignTargetAudience campaign={campaign} />
        <CampaignMessageContent messageBody={messageBody} />
      </ScrollView>

      {/* Bottom Bar */}
      {isPending && <CampaignBottomBar />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.surfaceLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.xlMd,
    paddingVertical: tokens.spacing.mdLg,
  },
  backButton: {
    padding: tokens.spacing.xs,
  },
  headerTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: '700',
    letterSpacing: tokens.typography.letterSpacing.label,
    color: tokens.colors.textSecondary,
    textTransform: 'uppercase',
  },
  headerRight: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.xlMd,
    paddingBottom: tokens.spacing.xxl,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.display,
    color: tokens.colors.textPrimary,
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.sm,
  },
  chipRow: {
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.smMd,
  },
  subtitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.xlMd,
  },
});
