import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import tokens from '@/theme/tokens';
import type { AppNotification } from '@/types/notification';
import { formatTimeAgo } from '@/utils/dateUtils';

export interface NotificationItemProps {
  item: AppNotification;
  onPress?: (item: AppNotification) => void;
}

type BadgeStyleKey = 'badgeDefault' | 'badgeAlert' | 'badgeExtension' | 'badgeUpgrade';

const getNotificationIconDetails = (item: AppNotification) => {
  if (item.icon && item.icon in Feather.glyphMap) {
    return {
      name: item.icon as keyof typeof Feather.glyphMap,
      badgeStyleKey: 'badgeDefault' as BadgeStyleKey,
      iconColor: tokens.colors.notificationIconDefaultText,
    };
  }

  if (item.type === 'audit_event' || item.type === 'alert') {
    const titleLower = item.title.toLowerCase();
    if (titleLower.includes('checkout') || titleLower.includes('cancel')) {
      return {
        name: 'alert-triangle' as const,
        badgeStyleKey: 'badgeAlert' as BadgeStyleKey,
        iconColor: tokens.colors.notificationIconAlertText,
      };
    }
    if (titleLower.includes('extend')) {
      return {
        name: 'clock' as const,
        badgeStyleKey: 'badgeExtension' as BadgeStyleKey,
        iconColor: tokens.colors.blue,
      };
    }
    return {
      name: 'alert-triangle' as const,
      badgeStyleKey: 'badgeAlert' as BadgeStyleKey,
      iconColor: tokens.colors.notificationIconAlertText,
    };
  }

  if (item.type === 'upgrade') {
    return {
      name: 'star' as const,
      badgeStyleKey: 'badgeUpgrade' as BadgeStyleKey,
      iconColor: tokens.colors.notificationIconUpgradeText,
    };
  }

  if (item.type === 'campaign') {
    return {
      name: 'volume-2' as const,
      badgeStyleKey: 'badgeDefault' as BadgeStyleKey,
      iconColor: tokens.colors.notificationIconDefaultText,
    };
  }

  return {
    name: 'file-text' as const,
    badgeStyleKey: 'badgeDefault' as BadgeStyleKey,
    iconColor: tokens.colors.notificationIconDefaultText,
  };
};

export function NotificationItem({ item, onPress }: NotificationItemProps) {
  const { name, badgeStyleKey, iconColor } = getNotificationIconDetails(item);
  const isUnread = !item.read;
  const timeText = formatTimeAgo(item.createdAt || item.timestamp);
  const bodyText = item.body || item.description || '';

  return (
    <TouchableOpacity
      style={[styles.container, isUnread && styles.unreadContainer]}
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${timeText}`}
    >
      <View style={styles.leftIndicatorSlot}>
        {isUnread ? <View style={styles.unreadDot} /> : null}
      </View>

      <View style={[styles.iconBadge, styles[badgeStyleKey]]}>
        <Feather name={name} size={20} color={iconColor} />
      </View>

      <View style={styles.contentCol}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.timestamp}>{timeText}</Text>
        </View>
        <Text style={styles.description}>{bodyText}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.notificationModal.itemPaddingVertical,
    paddingRight: tokens.notificationModal.itemPaddingHorizontal,
    backgroundColor: tokens.colors.background,
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
  },
  unreadContainer: {
    backgroundColor: tokens.colors.notificationUnreadBg,
  },
  leftIndicatorSlot: {
    width: tokens.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    width: tokens.notificationModal.unreadDotSize,
    height: tokens.notificationModal.unreadDotSize,
    borderRadius: tokens.notificationModal.unreadDotRadius,
    backgroundColor: tokens.colors.notificationUnreadDot,
  },
  iconBadge: {
    width: tokens.notificationModal.iconSize,
    height: tokens.notificationModal.iconSize,
    borderRadius: tokens.notificationModal.iconRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDefault: {
    backgroundColor: tokens.colors.notificationIconDefaultBg,
  },
  badgeAlert: {
    backgroundColor: tokens.colors.notificationIconAlertBg,
  },
  badgeExtension: {
    backgroundColor: tokens.colors.badgeExtensionBg,
  },
  badgeUpgrade: {
    backgroundColor: tokens.colors.notificationIconUpgradeBg,
  },
  contentCol: {
    flex: 1,
    marginLeft: tokens.spacing.mdLg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    flex: 1,
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.bodyLg,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    marginRight: tokens.spacing.sm,
  },
  timestamp: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: '500',
    color: tokens.colors.textMuted,
  },
  description: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '400',
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xxs,
    lineHeight: tokens.typography.lineHeight.body,
  },
});
