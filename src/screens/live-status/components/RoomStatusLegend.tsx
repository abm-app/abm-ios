import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import tokens from '@/theme/tokens';
import { getRoomStatusConfig } from '@/utils/roomUtils';
import type { RoomStatusType } from '@/types/status';

const LEGEND_STATUSES: RoomStatusType[] = [
  'occupied',
  'vacant',
  'checking_out',
  'arriving',
  'dirty',
  'maintenance',
  'management',
];

export default function RoomStatusLegend() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {LEGEND_STATUSES.map(status => {
        const config = getRoomStatusConfig(status);
        return (
          <View
            key={status}
            style={[
              styles.pill,
              { backgroundColor: config.colors.bg, borderColor: config.colors.border },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: config.colors.text }]} />
            <Text style={[styles.label, { color: config.colors.text }]} numberOfLines={1}>
              {config.label}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: tokens.spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.statusLegend.rowGap,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.statusLegend.pillGap,
    paddingVertical: tokens.statusLegend.pillPaddingVertical,
    paddingHorizontal: tokens.statusLegend.pillPaddingHorizontal,
    borderRadius: tokens.borderRadius.pill,
    borderWidth: tokens.borderWidth.thin,
  },
  dot: {
    width: tokens.statusLegend.dotSize,
    height: tokens.statusLegend.dotSize,
    borderRadius: tokens.statusLegend.dotBorderRadius,
  },
  label: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.badge,
    fontWeight: '600',
  },
});
