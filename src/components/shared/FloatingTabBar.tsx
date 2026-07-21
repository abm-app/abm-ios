import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import ENV from '@/config/env';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveTabLabel(
  options: BottomTabBarProps['descriptors'][string]['options'],
  isFocused: boolean,
  color: string,
  routeName: string,
) {
  if (options.tabBarLabel !== undefined) {
    if (typeof options.tabBarLabel === 'function') {
      return options.tabBarLabel({
        focused: isFocused,
        color,
        position: 'below-icon',
        children: '',
      });
    }
    return options.tabBarLabel;
  }
  if (options.title !== undefined) {
    return options.title;
  }
  return routeName;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const dynamicStyles = StyleSheet.create({
    safeArea: {
      paddingBottom: Math.max(insets.bottom, tokens.navigation.paddingVertical),
      paddingTop: tokens.navigation.paddingVertical,
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.safeArea]}>
      <View style={styles.shadowContainer}>
        <LinearGradient
          colors={[tokens.colors.navCapsuleGradientStart, tokens.colors.navCapsuleGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={styles.capsule}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;
              const color = isFocused ? tokens.colors.navActiveText : tokens.colors.navInactiveText;

              const label = resolveTabLabel(options, isFocused, color, route.name);

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
                  <Text
                    style={[
                      styles.tabLabel,
                      isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                    ]}
                  >
                    {label as string}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {/* Temporary Revenue Tab */}
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() =>
                (
                  navigation as unknown as {
                    navigate: (route: string, params?: Record<string, unknown>) => void;
                  }
                ).navigate('Operations', { screen: 'Revenue' })
              }
              style={styles.tabItem}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Feather
                  name="dollar-sign"
                  size={tokens.iconSizes.tabBar}
                  color={tokens.colors.navInactiveText}
                />
              </View>
              <Text style={[styles.tabLabel, styles.tabLabelInactive]}>Revenue</Text>
            </TouchableOpacity>

            {ENV.DEV_MODE_ENABLED && (
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => navigation.navigate('DesignSystemPreview' as never)}
                style={styles.tabItem}
                activeOpacity={0.8}
              >
                <View style={styles.iconContainer}>
                  <Feather
                    name="tool"
                    size={tokens.iconSizes.tabBar}
                    color={tokens.colors.navInactiveText}
                  />
                </View>
                <Text style={[styles.tabLabel, styles.tabLabelInactive]}>Dev</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
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
    paddingHorizontal: tokens.navigation.paddingHorizontal,
    backgroundColor: 'transparent',
  },
  shadowContainer: {
    width: '100%',
    borderRadius: tokens.navigation.borderRadius,
    ...tokens.shadow.navCapsule,
  },
  gradientBorder: {
    padding: tokens.spacing.xxs,
    borderRadius: tokens.navigation.borderRadius,
    width: '100%',
  },
  capsule: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.navCapsuleBg,
    borderRadius: tokens.navigation.borderRadius,
    height: tokens.navigation.height,
    paddingHorizontal: tokens.spacing.xxs,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: tokens.navigation.itemPaddingTop,
    paddingBottom: tokens.navigation.itemPaddingBottom,
    paddingHorizontal: tokens.navigation.itemPaddingHorizontal,
    borderRadius: tokens.navigation.itemBorderRadius,
  },
  tabItemActive: {
    backgroundColor: tokens.colors.navActiveBg,
  },
  iconContainer: {
    marginBottom: tokens.navigation.itemGap,
    alignItems: 'center',
    justifyContent: 'center',
    height: tokens.iconSizes.tabBar,
  },
  tabLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.navLabel,
    lineHeight: tokens.typography.lineHeight.navLabel,
    letterSpacing: tokens.typography.letterSpacing.navLabel,
    fontWeight: tokens.typography.fontWeight.semibold,
  },
  tabLabelActive: {
    color: tokens.colors.navActiveText,
  },
  tabLabelInactive: {
    color: tokens.colors.navInactiveText,
  },
});
