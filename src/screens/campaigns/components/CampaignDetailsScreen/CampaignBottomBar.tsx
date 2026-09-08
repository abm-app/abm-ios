import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { Button } from '@/components/ui';
import { ConfirmationModal } from '@/components/shared';

export default function CampaignBottomBar({
  campaignName,
  onApprove,
  onReject,
}: {
  campaignName: string;
  onApprove: () => void;
  onReject: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [showRejectModal, setShowRejectModal] = React.useState(false);

  const handleRejectClose = () => {
    setShowRejectModal(false);
  };

  const handleRejectConfirm = () => {
    setShowRejectModal(false);
    onReject();
  };

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, tokens.spacing.lgMd) }]}
    >
      <Button
        label="Reject"
        variant="secondary"
        style={styles.rejectBtn}
        onPress={() => setShowRejectModal(true)}
      />
      <Button label="Approve" variant="primary" style={styles.approveBtn} onPress={onApprove} />

      <ConfirmationModal
        visible={showRejectModal}
        onClose={handleRejectClose}
        onConfirm={handleRejectConfirm}
        icon={<Feather name="alert-triangle" size={28} color={tokens.colors.danger} />}
        iconVariant="danger"
        title="Reject Campaign"
        content={`Are you sure you want to reject "${campaignName}"?`}
        confirmLabel="Reject"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: tokens.spacing.lgMd,
    borderTopWidth: tokens.borderWidth.hairline,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.background,
    gap: tokens.spacing.md,
  },
  rejectBtn: {
    flex: 1,
  },
  approveBtn: {
    flex: 1,
  },
});
