import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import tokens from '@/theme/tokens';

import { Button } from '@/components/ui';

// ─── Sub-Components ─────────────────────────────────────────────────────────

const SearchInput = ({
  searchValue,
  onSearchChange,
  onBlur,
}: {
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onBlur: () => void;
}) => (
  <View style={styles.searchInputContainer}>
    <TextInput
      style={styles.searchInput}
      placeholder="Search..."
      placeholderTextColor={tokens.colors.textMuted}
      autoFocus
      onBlur={onBlur}
      value={searchValue}
      onChangeText={onSearchChange}
    />
    {!!searchValue && (
      <TouchableOpacity
        style={styles.clearSearchButton}
        onPress={() => onSearchChange?.('')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Clear search"
      >
        <Feather name="x" size={16} color={tokens.colors.textMuted} />
      </TouchableOpacity>
    )}
  </View>
);

const RefreshButton = ({
  isRefreshing,
  onPress,
}: {
  isRefreshing?: boolean;
  onPress?: () => void;
}) => {
  const [spinAnim] = useState(() => new Animated.Value(0));
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (isRefreshing || isSpinning) {
      const loopAnim = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 750,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      loopAnim.start();
      return () => {
        loopAnim.stop();
        spinAnim.setValue(0);
      };
    } else {
      spinAnim.setValue(0);
    }
  }, [isRefreshing, isSpinning, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const dynamicStyles = StyleSheet.create({
    spinTransform: {
      transform: [{ rotate: spin }],
    },
  });

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 750);
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={handlePress}
      disabled={isRefreshing || isSpinning}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Refresh"
    >
      <Animated.View style={dynamicStyles.spinTransform}>
        <Feather name="refresh-cw" size={18} color={tokens.colors.textPrimary} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const ActionButtons = ({
  showSearch,
  isSearching,
  showFilter,
  showRightButton,
  showNotifications,
  notificationCount,
  showRefresh,
  isRefreshing,
  onRefreshPress,
  rightButtonText,
  onSearchPress,
  onFilterPress,
  onRightButtonPress,
  onNotificationsPress,
  showViewModeToggle,
  viewMode,
  onViewModeChange,
  showLogout,
  onLogoutPress,
}: {
  showSearch: boolean;
  isSearching: boolean;
  showFilter: boolean;
  showRightButton: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
  showRefresh?: boolean;
  isRefreshing?: boolean;
  onRefreshPress?: () => void;
  rightButtonText: string;
  showViewModeToggle?: boolean;
  viewMode?: 'list' | 'grid';
  onViewModeChange?: (mode: 'list' | 'grid') => void;
  showLogout?: boolean;
  onLogoutPress?: () => void;
  onSearchPress: () => void;
  onFilterPress?: () => void;
  onRightButtonPress?: () => void;
  onNotificationsPress?: () => void;
}) => (
  <View style={styles.rightRow}>
    {showSearch && !isSearching && (
      <TouchableOpacity style={styles.iconButton} onPress={onSearchPress} activeOpacity={0.7}>
        <Feather name="search" size={20} color={tokens.colors.textPrimary} />
      </TouchableOpacity>
    )}
    {showFilter && (
      <TouchableOpacity style={styles.iconButton} onPress={onFilterPress} activeOpacity={0.7}>
        <Feather name="filter" size={20} color={tokens.colors.textPrimary} />
      </TouchableOpacity>
    )}
    {showViewModeToggle && onViewModeChange && viewMode && (
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
          onPress={() => onViewModeChange('list')}
          activeOpacity={0.8}
        >
          <Feather
            name="list"
            size={16}
            color={viewMode === 'list' ? tokens.colors.textPrimary : tokens.colors.textHint}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'grid' && styles.toggleBtnActive]}
          onPress={() => onViewModeChange('grid')}
          activeOpacity={0.8}
        >
          <Feather
            name="grid"
            size={16}
            color={viewMode === 'grid' ? tokens.colors.textPrimary : tokens.colors.textHint}
          />
        </TouchableOpacity>
      </View>
    )}
    {showRefresh && <RefreshButton isRefreshing={isRefreshing} onPress={onRefreshPress} />}
    {showNotifications && (
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onNotificationsPress || (() => console.log('Notifications pressed'))}
        activeOpacity={0.7}
      >
        <Feather name="bell" size={20} color={tokens.colors.textPrimary} />
        {notificationCount !== undefined ? (
          notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </Text>
            </View>
          )
        ) : (
          <View style={styles.notificationBadgeDot} />
        )}
      </TouchableOpacity>
    )}
    {showLogout && (
      <TouchableOpacity style={styles.logoutPill} activeOpacity={0.7} onPress={onLogoutPress}>
        <Text style={styles.logoutPillText}>Logout</Text>
      </TouchableOpacity>
    )}
    {showRightButton && (
      <Button
        label={rightButtonText}
        variant="primary"
        size="md"
        onPress={onRightButtonPress || (() => console.warn('Right button pressed'))}
        style={styles.actionButton}
      />
    )}
  </View>
);

// ─── Main Component ─────────────────────────────────────────────────────────

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
  showRefresh?: boolean;
  isRefreshing?: boolean;
  onRefreshPress?: () => void;
  showRightButton?: boolean;
  rightButtonText?: string;
  showViewModeToggle?: boolean;
  viewMode?: 'list' | 'grid';
  onViewModeChange?: (mode: 'list' | 'grid') => void;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  onNotificationsPress?: () => void;
  onRightButtonPress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showLogout?: boolean;
  onLogoutPress?: () => void;
}

export function ScreenHeaderV2({
  title,
  subtitle,
  showSearch = false,
  showFilter = false,
  showNotifications = true,
  notificationCount,
  showRefresh = false,
  isRefreshing = false,
  onRefreshPress,
  showRightButton = true,
  rightButtonText = 'New',
  showViewModeToggle = false,
  viewMode,
  onViewModeChange,
  searchValue,
  onSearchChange,
  onSearchPress,
  onFilterPress,
  onNotificationsPress,
  onRightButtonPress,
  showBackButton = false,
  onBackPress,
  showLogout = false,
  onLogoutPress,
}: ScreenHeaderProps) {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchPress = () => {
    setIsSearching(true);
    if (onSearchPress) onSearchPress();
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="arrow-left" size={22} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={styles.leftCol}>
          {showSearch && isSearching ? (
            <SearchInput
              searchValue={searchValue}
              onSearchChange={onSearchChange}
              onBlur={() => {
                if (!searchValue || searchValue.trim() === '') {
                  onSearchChange?.('');
                  setIsSearching(false);
                }
              }}
            />
          ) : (
            <>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </>
          )}
        </View>
      </View>
      <ActionButtons
        showSearch={showSearch}
        isSearching={isSearching}
        showFilter={showFilter}
        showNotifications={showNotifications}
        notificationCount={notificationCount}
        showRefresh={showRefresh}
        isRefreshing={isRefreshing}
        onRefreshPress={onRefreshPress}
        showRightButton={showRightButton}
        rightButtonText={rightButtonText}
        showViewModeToggle={showViewModeToggle}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onSearchPress={handleSearchPress}
        onFilterPress={onFilterPress}
        onNotificationsPress={onNotificationsPress}
        onRightButtonPress={onRightButtonPress}
        showLogout={showLogout}
        onLogoutPress={onLogoutPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.xlMd,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: tokens.spacing.sm,
    paddingRight: tokens.spacing.lg,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftCol: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.display,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: tokens.colors.textPrimary,
  },
  subtitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: '400',
    color: tokens.colors.textMuted,
    marginTop: -tokens.spacing.xxs,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.mdLg,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.background,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.pill,
    padding: tokens.spacing.xxs,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
  },
  toggleBtn: {
    padding: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.pill,
  },
  toggleBtnActive: {
    backgroundColor: tokens.colors.white,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButton: {
    borderRadius: tokens.borderRadius.pill,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.borderRadius.smMd,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
    height: tokens.input.height,
  },
  searchInput: {
    flex: 1,
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.bodyLg,
    color: tokens.colors.textPrimary,
    height: tokens.input.height,
    paddingHorizontal: tokens.spacing.mdLg,
  },
  clearSearchButton: {
    padding: tokens.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.danger,
    borderWidth: tokens.borderWidth.thick,
    borderColor: tokens.colors.background,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: tokens.colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: tokens.borderWidth.thick,
    borderColor: tokens.colors.background,
    paddingHorizontal: tokens.spacing.xs,
  },
  notificationBadgeText: {
    color: tokens.colors.white,
    fontSize: tokens.typography.fontSize.badge,
    fontWeight: 'bold',
  },
  logoutPill: {
    paddingHorizontal: tokens.spacing.lgMd,
    paddingVertical: tokens.spacing.xs,
    backgroundColor: tokens.colors.badgeHighBg,
    borderRadius: tokens.borderRadius.pill,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.danger,
  },
  logoutPillText: {
    color: tokens.colors.danger,
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: tokens.typography.fontWeight.semibold,
  },
});
