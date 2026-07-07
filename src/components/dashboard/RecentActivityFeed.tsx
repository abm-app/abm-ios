import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '../../theme/tokens';
import type { RecentEvent } from '../../types/dashboard';

interface RecentActivityFeedProps {
  events: RecentEvent[];
}

function getEventDisplayInfo(event: RecentEvent) {
  const isVip = event.guestName.startsWith('A.');

  let iconName: React.ComponentProps<typeof Feather>['name'] = 'star';
  let iconColor: string = tokens.colors.avatarWarmIcon;
  let avatarBg: string = tokens.colors.avatarWarmBg;
  let eventDescription = 'Activity';

  if (isVip) {
    iconName = 'star';
    iconColor = tokens.colors.avatarWarmIcon;
    avatarBg = tokens.colors.avatarWarmBg;
    eventDescription = 'VIP Arrival';
  } else if (event.type === 'check_in') {
    iconName = 'log-out';
    iconColor = tokens.colors.textPrimary;
    avatarBg = tokens.colors.surface;
    eventDescription = `Room ${event.room} Check-in`;
  } else if (event.type === 'rate_override') {
    iconName = 'bell';
    iconColor = tokens.colors.textPrimary;
    avatarBg = tokens.colors.surface;
    eventDescription = `Room Service Request • ${event.room}`;
  }

  const line1 = `${eventDescription} • ${event.guestName}`;
  const timestamp = new Date(event.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return { iconName, iconColor, avatarBg, line1, timestamp };
}

export default function RecentActivityFeed({ events }: RecentActivityFeedProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleEvents = expanded ? events : events.slice(0, 3);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>

      <View style={styles.listContainer}>
        {visibleEvents.map((event, index) => {
          const isLast = index === visibleEvents.length - 1;
          const { iconName, iconColor, avatarBg, line1, timestamp } = getEventDisplayInfo(event);

          return (
            <View key={event.id} style={[styles.row, !isLast && styles.rowBorder]}>
              <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
                <Feather name={iconName} size={tokens.iconSizes.avatar} color={iconColor} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.eventText}>{line1}</Text>
                <Text style={styles.timestampText}>{timestamp}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {!expanded && events.length > 3 && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setExpanded(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>VIEW ALL ACTIVITY</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: tokens.spacing.lgMd,
  },
  sectionTitle: {
    fontSize: tokens.typography.fontSize.label,
    letterSpacing: tokens.typography.letterSpacing.caps,
    textTransform: 'uppercase',
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.lgMd,
    paddingHorizontal: tokens.spacing.xlMd,
  },
  listContainer: {
    backgroundColor: tokens.colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.xlMd,
  },
  rowBorder: {
    borderBottomWidth: tokens.borderWidth.thin,
    borderBottomColor: tokens.colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.mdLg,
  },
  textContainer: {
    flex: 1,
  },
  eventText: {
    fontSize: tokens.typography.fontSize.subhead,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
    marginBottom: 2,
  },
  timestampText: {
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
  button: {
    marginTop: tokens.spacing.lgMd,
    marginHorizontal: tokens.spacing.xlMd,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.borderMd,
    borderRadius: tokens.borderRadius.xl,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: tokens.typography.fontSize.label,
    letterSpacing: tokens.typography.letterSpacing.caps,
    textTransform: 'uppercase',
    fontWeight: '600',
    color: tokens.colors.textSecondary,
  },
});
