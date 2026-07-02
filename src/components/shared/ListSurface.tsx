import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import tokens from '@/theme/tokens';

interface ListSurfaceProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function ListSurface({ children, style }: ListSurfaceProps) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.borderRadius.xl,
    padding: tokens.spacing.xlMd,
    shadowColor: tokens.shadow.modal.shadowColor,
    shadowOffset: tokens.shadow.modal.shadowOffset,
    shadowOpacity: tokens.shadow.modal.shadowOpacity,
    shadowRadius: tokens.shadow.modal.shadowRadius,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
  },
});
