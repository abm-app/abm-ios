import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { MenuStackParamList } from '@/navigation/types';
import { Backdrop, EmptyState, ScreenHeaderV2 } from '@/components/shared';

type MenuNavProp = NativeStackNavigationProp<MenuStackParamList>;

// Placeholder shell so the route works. The list, filters and entry form arrive with Phase 3.
export default function ExpensesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MenuNavProp>();

  const rootStyle = useMemo(() => [styles.root, { paddingTop: insets.top }], [insets.top]);

  return (
    <View style={rootStyle}>
      <Backdrop />

      <ScreenHeaderV2
        title="Expenses"
        showBackButton
        onBackPress={() => navigation.goBack()}
        showNotifications={false}
      />

      <View style={styles.centerContainer}>
        <EmptyState
          icon="credit-card"
          title="Expenses"
          subtitle="Extra expenses will be listed here."
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
