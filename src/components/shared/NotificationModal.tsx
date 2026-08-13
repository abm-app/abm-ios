import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';
import NotificationItem from './NotificationItem';
import EmptyState from './EmptyState';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import type { AppNotification } from '@/types/notification';

export interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  notifications?: AppNotification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onSelectNotification?: (item: AppNotification) => void;
}

export function NotificationModal({
  visible,
  onClose,
  notifications: customNotifications,
  onMarkAsRead: customMarkAsRead,
  onMarkAllAsRead: customMarkAllAsRead,
  onSelectNotification,
}: NotificationModalProps) {
  const insets = useSafeAreaInsets();
  const hookState = useNotifications();

  const notifications = customNotifications ?? hookState.notifications;
  const markAsRead = customMarkAsRead ?? hookState.markAsRead;
  const markAllAsRead = customMarkAllAsRead ?? hookState.markAllAsRead;

  const [slideAnim] = useState(() => new Animated.Value(600));

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(600);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleItemPress = (item: AppNotification) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    if (onSelectNotification) {
      onSelectNotification(item);
    }
  };

  const dynamicStyles = StyleSheet.create({
    cardTransform: {
      transform: [{ translateY: slideAnim }],
    },
    scrollSafeArea: {
      paddingBottom: Math.max(insets.bottom, tokens.notificationModal.minPaddingBottom),
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.modalCard, dynamicStyles.cardTransform]}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.title}>Notifications</Text>
            <TouchableOpacity onPress={markAllAsRead} activeOpacity={0.7}>
              <Text style={styles.markAllReadText}>Mark all as read</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={[styles.scrollContent, dynamicStyles.scrollSafeArea]}
            showsVerticalScrollIndicator={false}
          >
            {notifications.length === 0 ? (
              <EmptyState
                icon="bell"
                title="No notifications"
                subtitle="You are all caught up! Check back later for updates."
              />
            ) : (
              <>
                {notifications.map(item => (
                  <NotificationItem key={item.id} item={item} onPress={handleItemPress} />
                ))}
                <Text style={styles.endText}>End of notifications</Text>
              </>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default NotificationModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: tokens.colors.secondary,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: tokens.colors.background,
    borderTopLeftRadius: tokens.notificationModal.cornerRadius,
    borderTopRightRadius: tokens.notificationModal.cornerRadius,
    ...tokens.shadow.modal,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  dragHandle: {
    width: tokens.notificationModal.dragHandleWidth,
    height: tokens.notificationModal.dragHandleHeight,
    borderRadius: tokens.notificationModal.dragHandleRadius,
    backgroundColor: tokens.colors.notificationDragHandle,
    marginTop: tokens.notificationModal.dragHandleMarginTop,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.notificationModal.paddingHorizontal,
    paddingTop: tokens.notificationModal.paddingTop,
    paddingBottom: tokens.notificationModal.paddingBottom,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.notificationModal.titleFontSize,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  markAllReadText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.notificationModal.markAllReadFontSize,
    fontWeight: '600',
    color: tokens.colors.notificationUnreadDot,
  },
  scrollArea: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingBottom: tokens.spacing.xl,
  },
  endText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.notificationModal.footerFontSize,
    fontWeight: '500',
    color: tokens.colors.textMuted,
    textAlign: 'center',
    paddingVertical: tokens.notificationModal.footerPaddingVertical,
  },
});
