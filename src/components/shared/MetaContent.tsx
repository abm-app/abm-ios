import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import tokens from '@/theme/tokens';

const WA_BG_URL =
  'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png';

interface MetaContentProps {
  body: string | undefined;
  time?: string;
}

export default function MetaContent({ body, time = '09:41 AM' }: MetaContentProps) {
  if (!body) return null;

  return (
    <View style={styles.previewSection}>
      <ImageBackground
        source={{ uri: WA_BG_URL }}
        style={styles.previewBg}
        imageStyle={styles.previewBgImage}
      >
        <View style={styles.bubble}>
          <View style={styles.tail} />
          <Text style={styles.bubbleText}>{body}</Text>
          <Text style={styles.bubbleTime}>{time}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  previewSection: {
    marginBottom: tokens.spacing.mdLg,
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
  },
  previewBg: {
    padding: tokens.spacing.xl,
    backgroundColor: tokens.colors.waWallpaperBg,
  },
  previewBgImage: {
    opacity: 0.4,
  },
  bubble: {
    backgroundColor: tokens.colors.white,
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.lg,
    borderTopLeftRadius: 0,
    position: 'relative',
    ...tokens.shadow.chatBubble,
  },
  tail: {
    position: 'absolute',
    top: 0,
    left: -10,
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderLeftWidth: 10,
    borderTopColor: tokens.colors.white,
    borderLeftColor: 'transparent',
  },
  bubbleText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    lineHeight: tokens.typography.lineHeight.body,
    color: tokens.colors.textPrimary,
  },
  bubbleTime: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
    alignSelf: 'flex-end',
    marginTop: tokens.spacing.xs,
  },
});
