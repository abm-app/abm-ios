import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { Button } from '@/components/ui';
import { ConfirmationModal } from '@/components/shared';

interface Props {
  status: 'active' | 'paused';
  onPause: () => void;
  onResume: () => void;
}

export default function AutomationBottomBar({ status, onPause, onResume }: Props) {
  const insets = useSafeAreaInsets();
  const [showResumeModal, setShowResumeModal] = React.useState(false);

  const handleResumeConfirm = () => {
    setShowResumeModal(false);
    onResume();
  };

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, tokens.spacing.lgMd) }]}
    >
      {status === 'active' ? (
        <Button
          label="Pause Automation"
          variant="secondary"
          style={styles.actionBtn}
          onPress={onPause}
        />
      ) : (
        <Button
          label="Resume Automation"
          variant="primary"
          style={styles.actionBtn}
          onPress={() => setShowResumeModal(true)}
        />
      )}

      <ConfirmationModal
        visible={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        onConfirm={handleResumeConfirm}
        icon={<Feather name="play-circle" size={28} color={tokens.colors.primary} />}
        title="Resume Automation"
        content="Guests who qualified while this automation was paused won't receive this message — resuming only affects guests who qualify from now on."
        confirmLabel="Resume"
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
  actionBtn: {
    flex: 1,
  },
});
