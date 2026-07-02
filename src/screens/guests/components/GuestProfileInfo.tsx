import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { Avatar } from '@/components/shared';

interface GuestProfileInfoProps {
  name: string;
  phone: string;
}

export default function GuestProfileInfo({ name, phone }: GuestProfileInfoProps) {
  return (
    <View style={styles.profileSection}>
      <Avatar name={name} size={64} />
      <Text style={styles.guestName}>{name}</Text>
      <Text style={styles.guestPhone}>{phone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.lg,
  },
  guestName: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.h1,
    color: tokens.colors.textPrimary,
    marginTop: tokens.spacing.md,
  },
  guestPhone: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xs,
  },
});
