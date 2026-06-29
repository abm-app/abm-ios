import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

import tokens from '@/theme/tokens';

export interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  title?: string;
  content?: string | React.ReactNode;
  buttonLabel?: string;
  iconVariant?: 'success' | 'danger';
  useModal?: boolean;
}

export function AlertModal({
  visible,
  onClose,
  icon,
  title,
  content,
  buttonLabel = 'Okay',
  iconVariant,
  useModal = true,
}: AlertModalProps) {
  if (!visible) return null;

  const contentBlock = (
    <View style={[styles.modalOverlay, !useModal && styles.absoluteOverlay]}>
      <View style={styles.modalCard}>
        {icon && (
          <View
            style={[
              styles.iconContainer,
              iconVariant === 'success' && styles.successIconWrapper,
              iconVariant === 'danger' && styles.dangerIconWrapper,
            ]}
          >
            {icon}
          </View>
        )}

        <View style={styles.messageBlock}>
          {title && <Text style={styles.modalTitle}>{title}</Text>}
          {content &&
            (typeof content === 'string' ? (
              <Text style={styles.modalDesc}>{content}</Text>
            ) : (
              content
            ))}
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.confirmBtn} onPress={onClose} accessibilityRole="button">
            <Text style={styles.confirmBtnText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (useModal === false) {
    return contentBlock;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {contentBlock}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: tokens.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xlMd,
  },
  absoluteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  modalCard: {
    width: 320,
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 26,
    alignItems: 'center',
    gap: 14,
    ...tokens.shadow.modal,
  },
  iconContainer: {
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBlock: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalTitle: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontWeight: '600',
    fontSize: 19,
    lineHeight: 23,
    color: tokens.colors.textPrimary,
    textAlign: 'center',
  },
  modalDesc: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.textMuted,
    textAlign: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    backgroundColor: tokens.colors.primary,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontWeight: '600',
    fontSize: 14,
    color: tokens.colors.background,
  },
  successIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: tokens.colors.badgeLowBg,
    borderWidth: 1,
    borderColor: tokens.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: tokens.colors.badgeHighBg,
    borderWidth: 1,
    borderColor: tokens.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
