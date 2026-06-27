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
  rightButtonText,
  onSearchPress,
  onFilterPress,
  onRightButtonPress,
}: {
  showSearch: boolean;
  isSearching: boolean;
  showFilter: boolean;
  showRightButton: boolean;
  rightButtonText: string;
  onSearchPress: () => void;
  onFilterPress?: () => void;
  onRightButtonPress?: () => void;
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
  showRightButton?: boolean;
  rightButtonText?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  onRightButtonPress?: () => void;
}

export function ScreenHeaderV2({
  title,
  subtitle,
  showSearch = false,
  showFilter = false,
  showRightButton = true,
  rightButtonText = 'New',
  searchValue,
  onSearchChange,
  onSearchPress,
  onFilterPress,
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
        showRightButton={showRightButton}
        rightButtonText={rightButtonText}
        onSearchPress={handleSearchPress}
        onFilterPress={onFilterPress}
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
});
