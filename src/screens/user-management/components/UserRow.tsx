import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import type { AuthUser } from '@/types/auth';

interface UserRowProps {
  user: AuthUser;
  onEdit: (user: AuthUser) => void;
  onDelete: (user: AuthUser) => void;
  isLast?: boolean;
}

export default function UserRow({ user, onEdit, onDelete, isLast }: UserRowProps) {
  // Mocking the toggle state since the API doesn't support active status yet
  const [isActive, setIsActive] = useState(true);

  // Generate initials for the avatar
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <View style={[styles.container, !isLast && styles.borderBottom]}>
      <View style={styles.leftContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.userName} numberOfLines={1}>
          {user.name}
        </Text>
      </View>

      <View style={styles.actions}>
        <Switch
          value={isActive}
          onValueChange={setIsActive}
          trackColor={{ false: tokens.colors.border, true: tokens.colors.primary }}
          thumbColor={tokens.colors.white}
          ios_backgroundColor={tokens.colors.border}
          style={styles.switch}
        />

        <TouchableOpacity
          onPress={() => onEdit(user)}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Feather name="edit-2" size={16} color={tokens.colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(user)}
          style={[styles.iconButton, styles.deleteButton]}
          activeOpacity={0.7}
        >
          <Feather name="trash-2" size={16} color={tokens.colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.xl,
    backgroundColor: tokens.colors.white,
  },
  borderBottom: {
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: tokens.spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: tokens.colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  avatarText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
  },
  userName: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    marginRight: tokens.spacing.xs,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: tokens.colors.badgeHighBg,
  },
});
