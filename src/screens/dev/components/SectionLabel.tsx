import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';

interface SectionLabelProps {
  title: string;
}

export default function SectionLabel({ title }: SectionLabelProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: tokens.dsSection.labelMarginBottom,
  },
  label: {
    fontSize: tokens.typography.fontSize.sectionLabel,
    fontWeight: tokens.typography.fontWeight.semibold,
    letterSpacing: tokens.typography.letterSpacing.sectionLabel,
    textTransform: 'uppercase',
    color: tokens.colors.textMuted,
    paddingBottom: tokens.dsSection.labelBottomPadding,
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
  },
});
