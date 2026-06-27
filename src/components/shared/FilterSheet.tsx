import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';

export interface FilterSheetProps {
  title: string;
  visible: boolean;
  onClose: () => void;
  showDragIndicator?: boolean;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function FilterSheet({
  title,
  visible,
  onClose,
  showDragIndicator = false,
  headerRight,
  footer,
  children,
}: FilterSheetProps) {
  const insets = useSafeAreaInsets();

  const [slideAnim] = React.useState(() => new Animated.Value(600));

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.sheetContainer, { transform: [{ translateY: slideAnim }] }]}>
          {showDragIndicator && (
            <View style={styles.dragIndicatorContainer}>
              <View style={styles.dragIndicator} />
            </View>
          )}
          <View style={[styles.header, showDragIndicator && styles.headerWithDrag]}>
            <Text style={styles.title}>{title}</Text>
            {headerRight && <View>{headerRight}</View>}
          </View>
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
          {footer && (
            <View
              style={[styles.footer, { paddingBottom: Math.max(insets.bottom, tokens.spacing.lg) }]}
            >
              {footer}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: tokens.colors.secondary,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    backgroundColor: tokens.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    ...tokens.shadow.modal,
    elevation: 24,
  },
  dragIndicatorContainer: {
    alignItems: 'center',
    paddingTop: 12,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: tokens.colors.border,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerWithDrag: {
    paddingTop: 16,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: 24,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
});
