import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

import tokens from '@/theme/tokens';

export interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon?: React.ReactNode;
  title?: string;
  content?: string | React.ReactNode;
  confirmLabel: string;
  confirmIcon?: React.ReactNode;
  iconVariant?: 'success' | 'danger';
  confirmDisabled?: boolean;
}

export function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  icon,
  title,
  content,
  confirmLabel,
  confirmIcon,
  iconVariant,
  confirmDisabled = false,
}: ConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
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
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} accessibilityRole="button">
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, confirmDisabled && styles.confirmBtnDisabled]}
              onPress={onConfirm}
              accessibilityRole="button"
              disabled={confirmDisabled}
            >
              {confirmIcon}
              <Text style={styles.confirmBtnText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: tokens.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
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
    gap: 10,
    width: '100%',
    justifyContent: 'center',
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontWeight: '600',
    fontSize: 14,
    color: tokens.colors.textPrimary,
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    backgroundColor: tokens.colors.primary,
    borderRadius: 999,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  confirmBtnText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontWeight: '600',
    fontSize: 14,
    color: tokens.colors.background,
  },
  confirmBtnDisabled: {
    opacity: 0.5,
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
