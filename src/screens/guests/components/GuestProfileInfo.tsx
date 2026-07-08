import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { Avatar } from '@/components/shared';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

interface GuestProfileInfoProps {
  name: string;
  phone: string;
}

export default function GuestProfileInfo({ name, phone }: GuestProfileInfoProps) {
  const glowSize = 240;
  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <View style={styles.glowWrapper}>
          <Svg width={glowSize} height={glowSize}>
            <Defs>
              <RadialGradient id="avatar-glow" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor={tokens.colors.authFog2} stopOpacity={0.4} />
                <Stop offset="50%" stopColor={tokens.colors.authFog3} stopOpacity={0.2} />
                <Stop offset="100%" stopColor={tokens.colors.authFog1} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={glowSize / 2} cy={glowSize / 2} r={glowSize / 2} fill="url(#avatar-glow)" />
          </Svg>
        </View>
        <Avatar name={name} size={72} />
      </View>
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
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
  },
  glowWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
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
