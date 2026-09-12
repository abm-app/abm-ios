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
import AutomationConfigCard from './components/CampaignDetailsScreen/AutomationConfigCard';
import AutomationBottomBar from './components/CampaignDetailsScreen/AutomationBottomBar';
import CreateCampaignModal from './components/CreateCampaignModal/CreateCampaignModal';
import CreateAutomationModal from './components/CreateAutomationModal/CreateAutomationModal';
import type { RootStackParamList } from '@/navigation/types';
import {
  useCampaign,
  useMetaTemplates,
  useDeleteCampaign,
  useUpdateCampaign,
} from '@/hooks/campaigns/useCampaigns';
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
  const deleteMutation = useDeleteCampaign();
  const updateMutation = useUpdateCampaign();

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

  const isAutomation = campaign.type === 'trigger';

  // Format status for Chip
  const AUTOMATION_STATUS_LABEL: Record<string, string> = {
    draft: 'Draft',
    pending_approval: 'Awaiting Approval',
    active: 'Active',
    paused: 'Paused',
    rejected: 'Rejected',
  };
  const statusLabel = isAutomation
    ? (AUTOMATION_STATUS_LABEL[campaign.status] ?? campaign.status)
    : campaign.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  const isPending = campaign.status === 'pending_approval';

  // Format dates
  const dateStr = new Date(campaign.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const creatorName = campaign.createdBy?.name || 'Unknown';

  const isOwner = user?.role === 'owner';
  const isManager = user?.role === 'manager';
  const isCreator = campaign.createdBy?.id === user?.id;

  const canEdit = isAutomation ? isOwner || (isManager && isCreator) : user?.role !== 'staff';
  const canDelete = isAutomation ? isOwner : user?.role !== 'staff';
  const canApproveReject = isOwner && isPending;
  const canPauseResume =
    isAutomation && isOwner && (campaign.status === 'active' || campaign.status === 'paused');

  const handleApprove = async () => {
    if (!campaign) return;
    try {
      await updateMutation.mutateAsync({
        id: campaign._id,
        payload: { status: isAutomation ? 'active' : 'approved' },
      });
      Alert.alert(
        isAutomation ? 'Automation Approved' : 'Campaign Approved',
        isAutomation
          ? 'The automation is now active and will start sending.'
          : 'The campaign has been approved and will be sent at the scheduled time.',
        [{ text: 'OK', style: 'cancel' }],
      );
    } catch {
      Alert.alert(
        'Error',
        isAutomation ? 'Failed to approve automation' : 'Failed to approve campaign',
      );
    }
  };

  const handleReject = async () => {
    if (!campaign) return;
    try {
      await updateMutation.mutateAsync({
        id: campaign._id,
        payload: { status: 'rejected', rejectionReason: 'Rejected by owner' },
      });
    } catch {
      Alert.alert(
        'Error',
        isAutomation ? 'Failed to reject automation' : 'Failed to reject campaign',
      );
    }
  };

  const handlePause = async () => {
    if (!campaign) return;
    try {
      await updateMutation.mutateAsync({
        id: campaign._id,
        payload: { status: 'paused' },
      });
    } catch {
      Alert.alert('Error', 'Failed to pause automation');
    }
  };

  const handleResume = async () => {
    if (!campaign) return;
    try {
      await updateMutation.mutateAsync({
        id: campaign._id,
        payload: { status: 'active' },
      });
    } catch {
      Alert.alert('Error', 'Failed to resume automation');
    }
  };

  const handleDelete = async () => {
    if (!campaign) return;
    try {
      await deleteMutation.mutateAsync(campaign._id);
      setIsDeleteModalVisible(false);
      navigation.goBack();
    } catch {
      Alert.alert(
        'Error',
        isAutomation ? 'Failed to delete automation' : 'Failed to delete campaign',
      );
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
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="chevron-left" size={24} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isAutomation ? 'Automation Details' : 'Campaign Details'}
          </Text>
        </View>

        {(canEdit || canDelete) && (
          <View style={styles.actionsContainer}>
            {canEdit && (
              <Button
                label="Edit"
                variant="secondary"
                size="sm"
                onPress={() => setIsEditModalVisible(true)}
                style={styles.pillButton}
              />
            )}
            {canDelete && (
              <Button
                label="Delete"
                variant="danger"
                size="sm"
                onPress={() => setIsDeleteModalVisible(true)}
                style={[styles.pillButton, styles.deleteButtonBorder]}
              />
            )}
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
          Submitted by: {creatorName} on {dateStr}
        </Text>

        {campaign.status === 'rejected' && campaign.rejectionReason && (
          <Text style={styles.rejectionText}>Reason: {campaign.rejectionReason}</Text>
        )}

        {/* Content Cards */}
        {isAutomation ? (
          <AutomationConfigCard campaign={campaign} />
        ) : (
          <CampaignTargetAudience campaign={campaign} />
        )}
        <CampaignMessageContent messageBody={messageBody} />

        {isAutomation && user?.role !== 'staff' && (
          <TouchableOpacity
            style={styles.runHistoryLink}
            onPress={() =>
              navigation.navigate('AutomationRunHistory', {
                id: campaign._id,
                name: campaign.name,
              })
            }
          >
            <Feather
              name="clock"
              size={tokens.iconSizes.content}
              color={tokens.colors.textPrimary}
            />
            <Text style={styles.runHistoryLinkText}>View Run History</Text>
            <Feather
              name="chevron-right"
              size={tokens.iconSizes.content}
              color={tokens.colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      {canApproveReject && (
        <CampaignBottomBar
          campaignName={campaign.name}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
      {canPauseResume && (
        <AutomationBottomBar
          status={campaign.status as 'active' | 'paused'}
          onPause={handlePause}
          onResume={handleResume}
        />
      )}

      {/* Modals */}
      {isEditModalVisible &&
        (isAutomation ? (
          <CreateAutomationModal
            visible={isEditModalVisible}
            onClose={() => setIsEditModalVisible(false)}
            initialData={campaign}
            onSuccess={refetch}
          />
        ) : (
          <CreateCampaignModal
            visible={isEditModalVisible}
            onClose={() => setIsEditModalVisible(false)}
            initialData={campaign}
            onSuccess={refetch}
          />
        ))}
      {isDeleteModalVisible && (
        <ConfirmationModal
          visible={isDeleteModalVisible}
          onClose={() => setIsDeleteModalVisible(false)}
          onConfirm={handleDelete}
          title={isAutomation ? 'Delete Automation' : 'Delete Campaign'}
          content={
            isAutomation
              ? 'This automation and its configuration will be permanently deleted — delivery history is kept.'
              : 'Are you sure you want to delete this campaign? This action cannot be undone.'
          }
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
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.headerTitle,
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
  rejectionText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.danger,
    marginBottom: tokens.spacing.xlMd,
    marginTop: -tokens.spacing.smMd,
  },
  runHistoryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.lg,
    paddingVertical: tokens.spacing.lgMd,
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.mdLg,
  },
  runHistoryLinkText: {
    flex: 1,
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
});
