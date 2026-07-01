import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { useNavigation } from '@react-navigation/native';

interface GuestProfileHeaderProps {
  doNotContact: boolean;
  onDncChange?: (value: boolean) => void;
}

export default function GuestProfileHeader({ doNotContact, onDncChange }: GuestProfileHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Feather name="arrow-left" size={24} color={tokens.colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.dncContainer}>
        <Text style={styles.dncLabel}>DNC</Text>
        <Switch
          value={doNotContact}
          onValueChange={onDncChange}
          trackColor={{ false: tokens.colors.borderMd, true: tokens.colors.danger }}
          thumbColor={tokens.colors.white}
          ios_backgroundColor={tokens.colors.borderMd}
          style={styles.switch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xlMd,
    paddingVertical: tokens.spacing.lg,
  },
  backButton: {
    padding: tokens.spacing.xs,
  },
  dncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dncLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginRight: tokens.spacing.sm,
    fontWeight: '500',
  },
  switch: {
    transform: [{ scale: 0.8 }],
  },
});
