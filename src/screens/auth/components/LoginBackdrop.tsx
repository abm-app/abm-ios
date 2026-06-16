import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import tokens from '@/theme/tokens';

// ─── Animation constants ─────────────────────────────────────────────────────
// These are animation behavior values, not design tokens.

const TRANSITION_MS = 3500;
const INITIAL_DELAY_MS = 100;
const ROTATIONS = [0, 90, 180, 270, 360];

// ─── Types ───────────────────────────────────────────────────────────────────

type Point = { x: number; y: number };

type EllipseConfig = {
  rgb: [number, number, number];
  baseW: number;
  baseH: number;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function rotatePoint(point: Point, degrees: number): Point {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: point.x * Math.cos(radians) - point.y * Math.sin(radians),
    y: point.x * Math.sin(radians) + point.y * Math.cos(radians),
  };
}

// ─── Fog Ellipse (SVG) ──────────────────────────────────────────────────────

function FogEllipse({ rgb, baseW, baseH }: EllipseConfig) {
  const [red, green, blue] = rgb;
  const id = `rg-${red}-${green}-${blue}`;
  const stopColor = `rgb(${red},${green},${blue})`;

  return (
    <Svg width={baseW} height={baseH} style={{ left: -baseW / 2, top: -baseH / 2 }}>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor={stopColor} stopOpacity={0.72} />
          <Stop offset="35%" stopColor={stopColor} stopOpacity={0.45} />
          <Stop offset="65%" stopColor={stopColor} stopOpacity={0.15} />
          <Stop offset="100%" stopColor={stopColor} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={baseW / 2} cy={baseH / 2} rx={baseW / 2} ry={baseH / 2} fill={`url(#${id})`} />
    </Svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LoginBackdrop() {
  const { width: W, height: H } = useWindowDimensions();
  const [phase] = useState(() => new Animated.Value(0));

  const { VARIANTS, ELLIPSES } = useMemo(() => {
    const BASE: Point[] = [
      { x: -W * 0.35, y: -H * 0.38 },
      { x: W * 0.35, y: -H * 0.15 },
      { x: W * 0.05, y: H * 0.4 },
    ];
    const VARIANTS = BASE.map(basePos => ROTATIONS.map(degrees => rotatePoint(basePos, degrees)));
    const ELLIPSES: EllipseConfig[] = [
      { rgb: [255, 175, 150], baseW: W * 1.5, baseH: H * 0.9 },
      { rgb: [255, 145, 105], baseW: W * 1.4, baseH: H * 0.85 },
      { rgb: [255, 210, 130], baseW: W * 1.45, baseH: H * 0.88 },
    ];
    return { BASE, VARIANTS, ELLIPSES };
  }, [W, H]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(INITIAL_DELAY_MS),
        ...[1, 2, 3, 4].map(toValue =>
          Animated.timing(phase, {
            toValue,
            duration: TRANSITION_MS,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ),
        Animated.timing(phase, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [phase]);

  return (
    <View pointerEvents="none" style={styles.root}>
      {ELLIPSES.map((ellipse, index) => {
        const variants = VARIANTS[index];
        const translateX = phase.interpolate({
          inputRange: [0, 1, 2, 3, 4],
          outputRange: variants.map(point => point.x),
        });
        const translateY = phase.interpolate({
          inputRange: [0, 1, 2, 3, 4],
          outputRange: variants.map(point => point.y),
        });

        return (
          <Animated.View
            key={ellipse.rgb.join('-')}
            style={[
              styles.ellipseAnchor,
              {
                left: W / 2,
                top: H / 2,
                transform: [{ translateX }, { translateY }],
              },
            ]}
          >
            <FogEllipse {...ellipse} />
          </Animated.View>
        );
      })}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    backgroundColor: tokens.colors.authBackdropBase,
  },
  ellipseAnchor: {
    position: 'absolute',
  },
});
