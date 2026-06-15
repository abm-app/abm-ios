import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import type { RootStackScreenProps } from '@/navigation/types';

type Props = RootStackScreenProps<'DevMenu'>;

export default function DevMenu({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Developer Menu</Text>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('DesignSystemPreview')}
      >
        <Feather name="layers" size={tokens.iconSizes.content} color={tokens.colors.textPrimary} />
        <Text style={styles.rowLabel}>Design System</Text>
        <Feather
          name="chevron-right"
          size={tokens.iconSizes.content}
          color={tokens.colors.textHint}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    padding: tokens.spacing.lgMd,
  },
  title: {
    fontSize: tokens.typography.fontSize.h2,
    fontFamily: tokens.typography.fontFamily.heading,
    fontWeight: tokens.typography.fontWeight.regular,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.mdLg,
    paddingVertical: tokens.spacing.mdLg,
    paddingHorizontal: tokens.spacing.lgMd,
    backgroundColor: tokens.colors.background,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.lg,
  },
  rowLabel: {
    flex: 1,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
  },
});
