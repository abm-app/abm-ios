import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';
import { Button } from '@/components/ui';

export default function CampaignBottomBar() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, tokens.spacing.lgMd) }]}
    >
      <Button label="Reject" variant="secondary" style={styles.rejectBtn} onPress={() => {}} />
      <Button
        label="Approve & Schedule"
        variant="primary"
        style={styles.approveBtn}
        onPress={() => {}}
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
    borderColor: tokens.colors.danger,
  },
  approveBtn: {
    flex: 2,
  },
});
