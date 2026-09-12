import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/shared';
import RunHistoryRow from './components/AutomationRunHistory/RunHistoryRow';
import { useInfiniteAutomationRuns } from '@/hooks/campaigns/useCampaigns';
import type { RootStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RunHistoryRouteProp = RouteProp<RootStackParamList, 'AutomationRunHistory'>;

export default function AutomationRunHistoryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RunHistoryRouteProp>();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteAutomationRuns(route.params.id);

  const runs = data?.pages.flatMap(page => page.runs) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={tokens.colors.primary} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="chevron-left" size={24} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Run History</Text>
          <Text style={styles.headerSubtitle}>{route.params.name}</Text>
        </View>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorState message={error?.message || 'Failed to load run history'} onRetry={refetch} />
      ) : (
        <FlatList
          data={runs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <RunHistoryRow run={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <EmptyState
              icon="clock"
              title="No Runs Yet"
              subtitle="This automation hasn’t been evaluated yet — runs appear here every evaluator cycle."
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xlMd,
    paddingVertical: tokens.spacing.mdLg,
  },
  backButton: {
    paddingRight: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.headerTitle,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: tokens.spacing.xlMd,
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.xxl,
  },
  footerLoader: {
    paddingVertical: tokens.spacing.xl,
    alignItems: 'center',
  },
});
