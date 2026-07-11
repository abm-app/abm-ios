import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  StyleProp,
  ViewStyle,
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
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function FilterSheet({
  title,
  visible,
  onClose,
  showDragIndicator = false,
  headerRight,
  footer,
  scrollable = true,
  contentStyle,
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
          {(!!title || !!headerRight) && (
            <View style={[styles.header, showDragIndicator && styles.headerWithDrag]}>
              {!!title && <Text style={styles.title}>{title}</Text>}
              {!!headerRight && <View>{headerRight}</View>}
            </View>
          )}
          {scrollable ? (
            <ScrollView
              style={styles.content}
              contentContainerStyle={[styles.contentContainer, contentStyle]}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.contentContainer, contentStyle]}>{children}</View>
          )}
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
    borderTopLeftRadius: tokens.borderRadius.xl,
    borderTopRightRadius: tokens.borderRadius.xl,
    maxHeight: '90%',
    ...tokens.shadow.modal,
    elevation: 24,
  },
  dragIndicatorContainer: {
    alignItems: 'center',
    paddingTop: tokens.spacing.mdLg,
  },
  dragIndicator: {
    width: 40,
    height: tokens.spacing.xs,
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.spacing.xxs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.xxl,
    paddingTop: tokens.spacing.xxl,
    paddingBottom: tokens.spacing.lgMd,
  },
  headerWithDrag: {
    paddingTop: tokens.spacing.lgMd,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.sharedFormModal.titleFontSize,
    fontWeight: '800',
    color: tokens.colors.textPrimary,
  },
  content: {},
  contentContainer: {
    paddingHorizontal: tokens.spacing.xxl,
    paddingBottom: tokens.spacing.xxl,
  },
  footer: {
    paddingHorizontal: tokens.spacing.xxl,
    paddingTop: tokens.spacing.lgMd,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.mdLg,
    borderTopWidth: tokens.borderWidth.thin,
    borderTopColor: tokens.colors.border,
  },
});
