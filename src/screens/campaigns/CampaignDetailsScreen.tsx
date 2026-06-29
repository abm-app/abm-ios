import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { Chip, Button } from '@/components/ui';
import { LoadingSpinner, ErrorState, ConfirmationModal } from '@/components/shared';
import CampaignTargetAudience from './components/CampaignDetailsScreen/CampaignTargetAudience';
import CampaignMessageContent from './components/CampaignDetailsScreen/CampaignMessageContent';
import CampaignBottomBar from './components/CampaignDetailsScreen/CampaignBottomBar';
import CreateCampaignModal from './components/CreateCampaignModal/CreateCampaignModal';
import type { RootStackParamList } from '@/navigation/types';
import { useCampaign, useMetaTemplates } from '@/hooks/campaigns/useCampaigns';
import { deleteCampaign } from '@/api/endpoints/campaignApi';
import { Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DetailsRouteProp = RouteProp<RootStackParamList, 'CampaignDetails'>;

export default function CampaignDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailsRouteProp>();
  const user = useAuthStore(state => state.user);

  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);

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

  const handleDelete = async () => {
    if (!campaign) return;
    try {
      await deleteCampaign(campaign._id);
      setIsDeleteModalVisible(false);
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to delete campaign');
      setIsDeleteModalVisible(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeftContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="chevron-left" size={24} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Campaign Details</Text>
        </View>

        {user?.role !== 'staff' && (
          <View style={styles.actionsContainer}>
            <Button
              label="Edit"
              variant="secondary"
              size="sm"
              onPress={() => setIsEditModalVisible(true)}
              style={styles.pillButton}
            />
            <Button
              label="Delete"
              variant="danger"
              size="sm"
              onPress={() => setIsDeleteModalVisible(true)}
              style={[styles.pillButton, styles.deleteButtonBorder]}
            />
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <Text style={styles.title}>{campaign.name}</Text>

        <View style={styles.chipRow}>
          <View style={styles.chipContainer}>
            <Chip
              label={statusLabel}
              active={isPending}
              tone={isPending ? 'warning' : 'primary'}
              textColor={isPending ? tokens.colors.primary : undefined}
            />
          </View>
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

      {/* Modals */}
      {isEditModalVisible && (
        <CreateCampaignModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          initialData={campaign}
          onSuccess={refetch}
        />
      )}
      {isDeleteModalVisible && (
        <ConfirmationModal
          visible={isDeleteModalVisible}
          onClose={() => setIsDeleteModalVisible(false)}
          onConfirm={handleDelete}
          title="Delete Campaign"
          content="Are you sure you want to delete this campaign? This action cannot be undone."
          confirmLabel="Delete"
          iconVariant="danger"
          icon={<Feather name="trash-2" size={32} color={tokens.colors.danger} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.xlMd,
    paddingVertical: tokens.spacing.mdLg,
  },
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    paddingRight: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  pillButton: {
    borderRadius: tokens.borderRadius.pill,
  },
  deleteButtonBorder: {
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.badgeHighText,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.smMd,
  },
  chipContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  subtitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.xlMd,
  },
});
