import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';

export default function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, tokens.spacing.xlMd) }]}
    >
      <View style={styles.capsuleWrapper}>
        <View style={styles.capsule}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            const color = isFocused ? tokens.colors.navActiveText : tokens.colors.textPrimary;

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[styles.tabItem, isFocused && styles.tabItemActive]}
                activeOpacity={0.8}
              >
                <View style={styles.iconContainer}>
                  {options.tabBarIcon &&
                    options.tabBarIcon({
                      focused: isFocused,
                      color,
                      size: tokens.iconSizes.tabBar,
                    })}
                </View>
                <Text style={[styles.tabLabel, { color }]}>{label as string}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xl,
    backgroundColor: 'transparent',
  },
  capsuleWrapper: {
    borderRadius: tokens.borderRadius.pill,
    backgroundColor: tokens.colors.white,
    ...tokens.shadow.navCapsule,
    paddingTop: 1.5,
    paddingHorizontal: 1.5,
    paddingBottom: 0,
    width: '100%',
  },
  capsule: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.navCapsuleBg,
    borderRadius: tokens.borderRadius.pill,
    padding: tokens.spacing.xs,
    width: '100%',
    justifyContent: 'space-between',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.pill,
  },
  tabItemActive: {
    backgroundColor: tokens.colors.navActiveBg,
  },
  iconContainer: {
    marginBottom: tokens.spacing.xxs,
  },
  tabLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    letterSpacing: tokens.typography.letterSpacing.navLabel,
    fontWeight: tokens.typography.fontWeight.medium,
  },
});
