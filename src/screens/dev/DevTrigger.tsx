import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import tokens from '@/theme/tokens';
import type { RootStackParamList } from '@/navigation/types';

type DevNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function DevTrigger() {
  const navigation = useNavigation<DevNavProp>();

  if (!__DEV__) return null;

  return (
    <TouchableOpacity
      onLongPress={() => navigation.navigate('DevMenu')}
      activeOpacity={0.7}
      style={styles.trigger}
      accessibilityLabel="Open developer menu"
    >
      <Text style={styles.label}>DEV</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  trigger: {
    position: 'absolute',
    bottom: tokens.spacing.lgMd,
    right: tokens.spacing.lgMd,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.sm,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
  },
  label: {
    fontSize: tokens.typography.fontSize.swatchValue,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textHint,
    letterSpacing: tokens.typography.letterSpacing.badge,
  },
});
