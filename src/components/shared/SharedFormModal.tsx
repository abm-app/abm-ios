import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';

import { Button } from '@/components/ui';

interface SharedFormModalProps {
  visible: boolean;
  title: string;
  buttonLabel: string;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

export const SharedFormModal = React.forwardRef<ScrollView, SharedFormModalProps>(
  ({ visible, title, buttonLabel, onClose, onSubmit, isSubmitting, children }, ref) => {
    const insets = useSafeAreaInsets();
    const [keyboardHeight] = React.useState(() => new Animated.Value(0));

    React.useEffect(() => {
      const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
      const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

      const showSub = Keyboard.addListener(showEvent, e => {
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height,
          duration: e.duration || 250,
          useNativeDriver: false,
        }).start();
      });

      const hideSub = Keyboard.addListener(hideEvent, e => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: e.duration || 250,
          useNativeDriver: false,
        }).start();
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, [keyboardHeight]);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <Animated.View style={[styles.modalOverlay, { paddingBottom: keyboardHeight }]}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.modalCard}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                <Feather name="x" size={20} color={tokens.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Content Area */}
            <ScrollView
              ref={ref}
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
              <Button
                label={buttonLabel}
                onPress={onSubmit}
                variant="primary"
                size="md"
                disabled={isSubmitting}
                loading={isSubmitting}
                style={styles.submitBtn}
              />
            </View>
          </View>
        </Animated.View>
      </Modal>
    );
  },
);

SharedFormModal.displayName = 'SharedFormModal';

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
    maxHeight: '90%',
    backgroundColor: tokens.colors.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    ...tokens.shadow.modal,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: 24,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  submitBtn: {
    width: '100%',
  },
});
