import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';

interface AvatarProps {
  name: string;
  size?: number;
  overlap?: boolean;
}

export function Avatar({ name, size = 28, overlap = false }: AvatarProps) {
  const getInitials = (n: string) => {
    if (!n) return '';
    const parts = n.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        overlap && { marginLeft: -(size * 0.3) },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.4 }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.background,
    borderWidth: 1.5,
    borderColor: tokens.colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: tokens.colors.textPrimary,
    fontWeight: '600',
    fontFamily: tokens.typography.fontFamily.sub,
  },
});
