import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
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

interface LegendPillsProps {
  scale: number;
}

function LegendPills({ scale }: LegendPillsProps) {
  const pillStyle = {
    gap: Math.round(tokens.statusLegend.pillGap * scale),
    paddingVertical: Math.round(tokens.statusLegend.pillPaddingVertical * scale),
    paddingHorizontal: Math.round(tokens.statusLegend.pillPaddingHorizontal * scale),
  };
  const dotStyle = {
    width: Math.max(1, Math.round(tokens.statusLegend.dotSize * scale)),
    height: Math.max(1, Math.round(tokens.statusLegend.dotSize * scale)),
    borderRadius: Math.max(1, Math.round(tokens.statusLegend.dotBorderRadius * scale)),
  };
  const labelStyle = {
    fontSize: Math.round(tokens.typography.fontSize.badge * scale),
  };

  return (
    <View style={[styles.row, { gap: Math.round(tokens.statusLegend.rowGap * scale) }]}>
      {LEGEND_STATUSES.map(status => {
        const config = getRoomStatusConfig(status);
        return (
          <View
            key={status}
            style={[
              styles.pill,
              pillStyle,
              { backgroundColor: config.colors.bg, borderColor: config.colors.border },
            ]}
          >
            <View style={[styles.dot, dotStyle, { backgroundColor: config.colors.text }]} />
            <Text style={[styles.label, labelStyle, { color: config.colors.text }]}>
              {config.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function RoomStatusLegend() {
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);
  const handleMeasureLayout = useCallback((event: LayoutChangeEvent) => {
    setNaturalWidth(event.nativeEvent.layout.width);
  }, []);

  const scale =
    containerWidth && naturalWidth
      ? Math.max(tokens.statusLegend.minScale, Math.min(1, containerWidth / naturalWidth))
      : 1;
  const isMeasured = containerWidth !== null && naturalWidth !== null;

  return (
    <View onLayout={handleContainerLayout}>
      {/* Off-screen, unscaled copy used only to measure the legend's natural width. */}
      <View style={styles.measurer} pointerEvents="none" onLayout={handleMeasureLayout}>
        <LegendPills scale={1} />
      </View>
      {isMeasured && <LegendPills scale={scale} />}
    </View>
  );
}

const styles = StyleSheet.create({
  measurer: {
    position: 'absolute',
    opacity: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: tokens.borderRadius.pill,
    borderWidth: tokens.borderWidth.thin,
  },
  dot: {
    flexShrink: 0,
  },
  label: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontWeight: '600',
  },
});
