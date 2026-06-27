import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import tokens from '@/theme/tokens';

export interface SegmentedControlTab {
  id: string;
  label: string;
}

export interface SegmentedControlProps {
  tabs: SegmentedControlTab[];
  activeTab: string;
  onChange: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl({ tabs, activeTab, onChange, style }: SegmentedControlProps) {
  return (
    <View style={[styles.tabContainer, style]}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
            onPress={() => onChange(tab.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    width: 380,
    maxWidth: '100%',
    height: 45,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 999,
    padding: 3,
    flexDirection: 'row',
    gap: 2,
    alignSelf: 'center',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
  },
  tabButtonActive: {
    backgroundColor: tokens.colors.white,
    borderWidth: 1,
    borderColor: tokens.colors.primary,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontWeight: '500',
    fontSize: 13,
    color: tokens.colors.textSecondary,
  },
  tabTextActive: {
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
});
