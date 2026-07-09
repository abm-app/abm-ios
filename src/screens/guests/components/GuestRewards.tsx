import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { useGuestRewards } from '@/hooks/rewards/useGuestRewards';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/shared';
import { Badge, Card } from '@/components/ui';

interface GuestRewardsProps {
  guestId: string;
}

export default function GuestRewards({ guestId }: GuestRewardsProps) {
  const { data: rewards, isLoading, isError, refetch } = useGuestRewards(guestId);

  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.stateContainer}>
        <ErrorState message="Failed to load rewards" onRetry={refetch} />
      </View>
    );
  }

  if (!rewards || rewards.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <EmptyState
          icon="gift"
          title="No rewards issued"
          subtitle="This guest hasn't received any rewards yet."
        />
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {rewards.map(reward => (
        <Card key={reward._id} variant="flat" padded style={styles.rewardCard}>
          <View style={styles.rewardHeader}>
            <Text style={styles.rewardName}>{reward.name}</Text>
            <Badge
              label={reward.status}
              variant={reward.status === 'active' ? 'low' : 'category'}
            />
          </View>

          <View style={styles.rewardDetails}>
            <View style={styles.detailRow}>
              <Feather
                name="calendar"
                size={tokens.iconSizes.inline}
                color={tokens.colors.textMuted}
              />
              <Text style={styles.detailText}>
                Issued: {new Date(reward.issuedAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Feather name="star" size={tokens.iconSizes.inline} color={tokens.colors.textMuted} />
              <Text style={styles.detailText}>{reward.pointsCost.toLocaleString()} pts</Text>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stateContainer: {
    padding: tokens.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  listContainer: {
    paddingVertical: tokens.spacing.md,
  },
  rewardCard: {
    marginBottom: tokens.spacing.md,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.sm,
  },
  rewardName: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    flex: 1,
    marginRight: tokens.spacing.sm,
  },
  rewardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: tokens.spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  detailText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
});
