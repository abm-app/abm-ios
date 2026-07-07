import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

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
  <TextInput
    style={styles.searchInput}
    placeholder="Search..."
    placeholderTextColor={tokens.colors.textMuted}
    autoFocus
    onBlur={onBlur}
    value={searchValue}
    onChangeText={onSearchChange}
  />
);

const ActionButtons = ({
  showSearch,
  isSearching,
  showFilter,
  showRightButton,
  showNotifications,
  notificationCount,
  rightButtonText,
  onSearchPress,
  onFilterPress,
  onRightButtonPress,
  onNotificationsPress,
}: {
  showSearch: boolean;
  isSearching: boolean;
  showFilter: boolean;
  showRightButton: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
  rightButtonText: string;
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
  showRightButton?: boolean;
  rightButtonText?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  onNotificationsPress?: () => void;
  onRightButtonPress?: () => void;
}

export function ScreenHeaderV2({
  title,
  subtitle,
  showSearch = false,
  showFilter = false,
  showNotifications = true,
  notificationCount,
  showRightButton = true,
  rightButtonText = 'New',
  searchValue,
  onSearchChange,
  onSearchPress,
  onFilterPress,
  onNotificationsPress,
  onRightButtonPress,
}: ScreenHeaderProps) {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchPress = () => {
    setIsSearching(true);
    if (onSearchPress) onSearchPress();
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        {isSearching ? (
          <SearchInput
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            onBlur={() => setIsSearching(false)}
          />
        ) : (
          <>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </>
        )}
      </View>
      <ActionButtons
        showSearch={showSearch}
        isSearching={isSearching}
        showFilter={showFilter}
        showNotifications={showNotifications}
        notificationCount={notificationCount}
        showRightButton={showRightButton}
        rightButtonText={rightButtonText}
        onSearchPress={handleSearchPress}
        onFilterPress={onFilterPress}
        onNotificationsPress={onNotificationsPress}
        onRightButtonPress={onRightButtonPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  leftCol: {
    flexDirection: 'column',
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: 34,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: tokens.colors.textPrimary,
  },
  subtitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 14,
    fontWeight: '400',
    color: tokens.colors.textMuted,
    marginTop: 4,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.background,
  },
  actionButton: {
    borderRadius: 999,
  },
  searchInput: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 16,
    color: tokens.colors.textPrimary,
    height: 40,
    backgroundColor: tokens.colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  notificationBadgeDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.danger,
    borderWidth: 1.5,
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
    borderWidth: 1.5,
    borderColor: tokens.colors.background,
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: tokens.colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
