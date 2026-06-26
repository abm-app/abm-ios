import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';

export default function LoadingSpinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={tokens.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
