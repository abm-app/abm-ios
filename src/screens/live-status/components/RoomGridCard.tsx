import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import type { LiveStatusRoom, RoomStatusType } from '@/types/status';

interface RoomGridCardProps {
  room: LiveStatusRoom;
}

export default function RoomGridCard({ room }: RoomGridCardProps) {
  const colors = getGridColors(room.status);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Text style={[styles.roomNumber, { color: colors.text }]}>{room.rmCode}</Text>
    </View>
  );
}

function getGridColors(status: RoomStatusType) {
  switch (status) {
    case 'occupied':
      return {
        bg: tokens.colors.statusOccupiedBg,
        text: tokens.colors.statusOccupiedText,
        border: tokens.colors.statusOccupiedBorder,
      };
    case 'checkout':
      return {
        bg: tokens.colors.statusCheckoutBg,
        text: tokens.colors.statusCheckoutText,
        border: tokens.colors.statusCheckoutBorder,
      };
    case 'arrival':
      return {
        bg: tokens.colors.statusArrivalBg,
        text: tokens.colors.statusArrivalText,
        border: tokens.colors.statusArrivalBorder,
      };
    case 'vacant':
    default:
      return {
        bg: tokens.colors.statusVacantBg,
        text: tokens.colors.statusVacantText,
        border: tokens.colors.statusVacantBorder,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    width: tokens.roomGridCard.width,
    height: tokens.roomGridCard.height,
    borderRadius: tokens.roomGridCard.borderRadius,
    padding: tokens.roomGridCard.padding,
    borderWidth: tokens.borderWidth.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomNumber: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: tokens.typography.fontWeight.semibold,
  },
});
