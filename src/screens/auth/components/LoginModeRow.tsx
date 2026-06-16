import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';

// ─── Props ───────────────────────────────────────────────────────────────────

interface LoginModeRowProps {
  designScale: number;
  isAdminLogin: boolean;
  onAdminLoginChange: (value: boolean) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function LoginModeRow({ designScale, isAdminLogin, onAdminLoginChange }: LoginModeRowProps) {
  const trackWidth = tokens.auth.toggleWidth * designScale;
  const trackHeight = tokens.auth.toggleHeight * designScale;
  const trackRadius = (tokens.auth.toggleHeight / 2) * designScale;
  const thumbSize = tokens.auth.toggleThumbSize * designScale;
  const thumbInset = tokens.auth.toggleThumbInset * designScale;
  const thumbLeft = isAdminLogin ? trackWidth - thumbSize - thumbInset : thumbInset;
  const labelFontSize = tokens.auth.fieldLabelFontSize * designScale;
  const labelLineHeight = tokens.auth.fieldLabelLineHeight * designScale;

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: isAdminLogin }}
        hitSlop={tokens.spacing.sm}
        onPress={() => onAdminLoginChange(!isAdminLogin)}
        style={styles.control}
      >
        <Text
          style={[
            styles.adminLabel,
            {
              fontSize: labelFontSize,
              lineHeight: labelLineHeight,
            },
          ]}
        >
          Admin Login
        </Text>
        <View
          style={[
            styles.track,
            {
              width: trackWidth,
              height: trackHeight,
              borderRadius: trackRadius,
              backgroundColor: isAdminLogin ? tokens.colors.primary : tokens.colors.authToggleTrack,
            },
          ]}
        >
          <View
            style={[
              styles.thumb,
              {
                width: thumbSize,
                height: thumbSize,
                borderRadius: thumbSize / 2,
                top: thumbInset,
                left: thumbLeft,
              },
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: tokens.spacing.sm,
  },
  adminLabel: {
    color: tokens.colors.authInk,
  },
  track: {
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    backgroundColor: tokens.colors.authThumbSurface,
    ...tokens.shadow.toggleThumb,
  },
});
