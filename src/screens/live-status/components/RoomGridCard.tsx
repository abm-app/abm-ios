import React from 'react';
import { Text, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import { getRoomStatusConfig } from '@/utils/roomUtils';
import type { LiveStatusRoom } from '@/types/status';

interface RoomGridCardProps {
  room: LiveStatusRoom;
  onPress: (room: LiveStatusRoom) => void;
}

export default function RoomGridCard({ room, onPress }: RoomGridCardProps) {
  const { colors } = getRoomStatusConfig(room.status);

  return (
    <Card
      variant="flat"
      onPress={() => onPress(room)}
      style={[styles.container, { backgroundColor: colors.bg, borderColor: colors.border }]}
    >
      <Text style={[styles.roomNumber, { color: colors.text }]}>{room.rmCode}</Text>
    </Card>
  );
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
