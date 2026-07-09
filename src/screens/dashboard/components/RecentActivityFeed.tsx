import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '../../../theme/tokens';
import { Card } from '../../../components/ui';
import type { RecentEvent } from '../../../types/dashboard';

interface RecentActivityFeedProps {
  events: RecentEvent[];
}

interface EventDisplayInfo {
  iconName: React.ComponentProps<typeof Feather>['name'];
  iconColor: string;
  iconBg: string;
  label: string;
}

function getEventDisplayInfo(event: RecentEvent): EventDisplayInfo {
  const isVip = event.guestName.startsWith('A.');

  if (isVip) {
    return {
      iconName: 'star',
      iconColor: tokens.colors.avatarWarmIcon,
      iconBg: tokens.colors.avatarWarmBg,
      label: 'VIP Arrival',
    };
  }

  if (event.type === 'check_in') {
    return {
      iconName: 'log-in',
      iconColor: tokens.colors.textPrimary,
      iconBg: tokens.colors.chipNeutralBg,
      label: 'Check-in',
    };
  }

  // rate_override
  return {
    iconName: 'bell',
    iconColor: tokens.colors.textPrimary,
    iconBg: tokens.colors.chipNeutralBg,
    label: 'Room Service',
  };
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RecentActivityFeed({ events }: RecentActivityFeedProps) {
  const visibleEvents = events.slice(0, 5);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>

      <View style={styles.listContainer}>
        {visibleEvents.map(event => {
          const { iconName, iconColor, iconBg, label } = getEventDisplayInfo(event);
          const time = formatTime(event.timestamp);

          return (
            <Card
              key={event.id}
              padded
              variant="shadow-outlined"
              shadow="elevatedCard"
              style={styles.card}
            >
              {/* Icon box */}
              <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                <Feather name={iconName} size={20} color={iconColor} />
              </View>

              {/* All details */}
              <View style={styles.textContainer}>
                {/* Top row: label + time */}
                <View style={styles.topRow}>
                  <Text style={styles.cardTitle}>{label}</Text>
                  <Text style={styles.timeText}>{time}</Text>
                </View>

                {/* Guest name */}
                <Text style={styles.guestName}>{event.guestName}</Text>

                {/* Room */}
                <View style={styles.roomRow}>
                  <Feather name="home" size={11} color={tokens.colors.textHint} />
                  <Text style={styles.roomText}>Room {event.room}</Text>
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.sm,
  },
  sectionTitle: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.h2,
    color: tokens.colors.textPrimary,
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
  },
  listContainer: {
    gap: tokens.spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.spacing.mdLg,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: tokens.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: tokens.spacing.xxs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  timeText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textHint,
  },
  guestName: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xxs,
    marginTop: tokens.spacing.xxs,
  },
  roomText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
  },
});
